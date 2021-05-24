package templates

import (
	"bytes"
	"errors"
	"fmt"
	"oasisbot/bot/tools"
	"time"

	"github.com/jonas747/template"

	"github.com/bwmarrin/discordgo"
)

var (
	DefaultFuncs = map[string]interface{}{
		// General functions
		"str":  ToString,
		"inc":  inc,
		"itr":  itr,
		"join": joinStrings,
		"ord":  ord,

		// Math related functions
		"add":        add,
		"sub":        sub,
		"mult":       mult,
		"div":        div,
		"mod":        mod,
		"pow":        pow,
		"sqrt":       sqrt,
		"round":      round,
		"roundCeil":  roundCeil,
		"roundFloor": roundFloor,
		"roundEven":  roundEven,

		// Other
		"slice": CreateSlice,
		"sdict": StringDictionary,
		"embed": CreateEmbed,
	}

	contextSetupFuncs = []ContextSetupFunc{}
)

type ContextSetupFunc func(ctx *Context)

type Context struct {
	Name string

	Guild   *discordgo.Guild
	Member  *discordgo.Member
	Message *discordgo.Message
	BotUser *discordgo.User

	CtxFuncs map[string]interface{}
	Data     map[string]interface{}
	Counters map[string]int

	FixedOutput string

	CurrentRun *contextRun
}

type contextRun struct {
	channel        *discordgo.Channel
	nested         bool
	parsedTemplate *template.Template

	EmbedsToSend map[string]*discordgo.MessageEmbed
}

func RegisterSetupFuncs(f ContextSetupFunc) {
	contextSetupFuncs = append(contextSetupFuncs, f)
}

func init() {
	RegisterSetupFuncs(baseContextFuncs)
}

func NewContext(g *discordgo.Guild, channel *discordgo.Channel, m *discordgo.Member) *Context {
	ctx := &Context{
		Guild:    g,
		Member:   m,
		CtxFuncs: make(map[string]interface{}),
		Data:     make(map[string]interface{}),
		Counters: make(map[string]int),
		CurrentRun: &contextRun{
			channel: channel,
		},
	}

	for _, fn := range contextSetupFuncs {
		fn(ctx)
	}

	return ctx
}

func (c *Context) Execute(s string) (string, error) {
	if c.Message == nil {
		return "", errors.New("Message not provided and OasisBot does not support DM's!")
	}
	c.setupData()

	parsed, err := c.Parse(s)
	if err != nil {
		return "", errors.New(fmt.Sprintf("Template parsing failed!\n`%s`", err.Error()))
	}

	c.CurrentRun.parsedTemplate = parsed

	return c.executeParsed()
}

func (c *Context) Parse(s string) (*template.Template, error) {
	t := template.New(c.Name)
	t.Funcs(DefaultFuncs)
	t.Funcs(c.CtxFuncs)

	parsed, err := t.Parse(s)
	if err != nil {
		return nil, err
	}

	return parsed, nil
}

func (c *Context) executeParsed() (r string, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = errors.New("Panicked!")
		}
	}()
	parsed := c.CurrentRun.parsedTemplate
	var b bytes.Buffer

	parsed = parsed.MaxOps(1000000)
	err = parsed.Execute(&b, c.Data)
	if c.FixedOutput != "" {
		return c.FixedOutput, nil
	}

	result := b.String()
	if err != nil {
		return result, errors.New(fmt.Sprintf("Error executing template!\n`%s`", err.Error()))
	}
	return result, nil
}

func (c *Context) createNestedRun() {
	prev := c.CurrentRun
	c.CurrentRun = &contextRun{
		channel: prev.channel,
		nested:  true,
	}
}

func (c *Context) setupData() {
	if c.Guild != nil {
		guild := *c.Guild
		c.Data["server"] = guild
		c.Data["guild"] = guild
		c.Data["message"] = *(c.Message)
		c.Data["channel"] = *(c.CurrentRun.channel)
	}

	if c.Member != nil {
		member := *c.Member
		c.Data["member"] = member
		c.Data["user"] = member
	}
}

func baseContextFuncs(c *Context) {
	// Send, edit, and delete messages
	c.CtxFuncs["sendMessage"] = c.sendMessage(false)
	c.CtxFuncs["sendMessageID"] = c.sendMessage(true)
	c.CtxFuncs["sendTemplate"] = c.sendTemplate(false)
	c.CtxFuncs["sendTemplateID"] = c.sendTemplate(true)
	c.CtxFuncs["editMessage"] = c.editMessage
	c.CtxFuncs["deleteMessage"] = c.deleteMessage

	// Getters
	c.CtxFuncs["getRole"] = c.getRole
	c.CtxFuncs["getMember"] = c.getMember
	c.CtxFuncs["getChannel"] = c.getChannel

	// Roles
	c.CtxFuncs["hasRoleID"] = c.hasRoleID
	c.CtxFuncs["hasRoleName"] = c.hasRoleName
	c.CtxFuncs["targetHasRoleID"] = c.targetHasRoleID
	c.CtxFuncs["targetHasRoleName"] = c.targetHasRoleName
	c.CtxFuncs["addRoleID"] = c.addRoleID
	c.CtxFuncs["addRoleName"] = c.addRoleName
	c.CtxFuncs["targetAddRoleID"] = c.targetAddRoleID
	c.CtxFuncs["targetAddRoleName"] = c.targetAddRoleName
	c.CtxFuncs["removeRoleID"] = c.removeRoleID
	c.CtxFuncs["removeRoleName"] = c.removeRoleName
	c.CtxFuncs["targetRemoveRoleID"] = c.targetRemoveRoleID
	c.CtxFuncs["targetRemoveRoleName"] = c.targetRemoveRoleName
}

func (c *Context) IncCounter(key string, max int) bool {
	value, ok := c.Counters[key]
	if !ok {
		value = 0
	}
	value++
	c.Counters[key] = value
	return value > max
}

func DeleteMessage(guildID string, channelID string, messageID string, delay int) {
	go func() {
		if delay > 0 {
			time.Sleep(time.Duration(delay) * time.Second)
		}
		tools.MessageDeleteQueue.DeleteMessages(guildID, channelID, messageID)
	}()
}
