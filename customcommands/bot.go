package customcommands

import (
	"errors"
	"fmt"
	"math/rand"
	eventsystem "oasisbot/bot/events"
	"oasisbot/common"
	"oasisbot/common/templates"
	"oasisbot/util"
	"strconv"
	"strings"

	"github.com/bwmarrin/discordgo"
)

func (p *Plugin) BotInit() {
	eventsystem.AddHandler(eventsystem.EventMessageCreate, func(e *eventsystem.EventData) {
		s := e.Session
		m := e.MessageCreate()
		if len(e.MessageCreate().GuildID) == 0 {
			return // OasisBot does not support DM's
		}
		if m.Author.ID == s.State.User.ID { // Ignore all messages sent by the bot itself
			return
		} else if m.Author.Bot {
			return
		}

		prefix := util.GetPrefix(m.GuildID)
		if strings.HasPrefix(m.Content, prefix) {
			fields := strings.Fields(m.Content)
			if command := GetCommand(m.GuildID, fields[0][1:]); command != nil {
				h := CreateCustomCommandHandler(command)
				h(s, m, fields[1:], m.Content[1:])
			}
		}
	})
}

func CreateCustomCommandHandler(c *Command) func(s *discordgo.Session, m *discordgo.MessageCreate, args []string, stripped string) {
	return func(s *discordgo.Session, m *discordgo.MessageCreate, args []string, stripped string) { // TODO: Advanced custom commands that can handle args
		if !c.Enabled {
			return
		}
		if c.ForbiddenChannels != nil && len(c.ForbiddenChannels) > 0 {
			for _, channel := range c.ForbiddenChannels {
				if channel == m.ChannelID {
					noUseFuncChannel(s, m)
					return
				}
			}
		}
		if c.AllowedRoles != nil && len(c.AllowedRoles) > 0 {
			for _, role := range c.AllowedRoles {
				for _, memRole := range m.Member.Roles {
					if role == memRole {
						goto NEXT
					}
				}
			}
			noUseFuncRole(s, m)
			return
		}
	NEXT:
		if c.ForbiddenRoles != nil && len(c.ForbiddenRoles) > 0 {
			for _, role := range c.ForbiddenRoles {
				for _, memRole := range m.Member.Roles {
					if role == memRole {
						noUseFuncRole(s, m)
						return
					}
				}
			}
		}
		switch c.Type {
		case CommandTypeBasic:
			s.ChannelMessageSend(m.ChannelID, HandleResponse(m, c.Responses[0]))
		case CommandTypeRandomized:
			index := rand.Intn(len(c.Responses))
			s.ChannelMessageSend(m.ChannelID, HandleResponse(m, c.Responses[index]))
		case CommandTypeRole:
			var err error
			before := m.Member.Roles
			for _, role := range c.AssignedRoles {
				err = s.GuildMemberRoleAdd(m.GuildID, m.Author.ID, role)
			}
			member, _ := common.BotSession.State.Member(m.GuildID, m.Author.ID)
			if util.UnorderedEqual(before, member.Roles) {
				return
			}
			if err == nil {
				reaction := c.PostReaction
				if reaction == "" {
					reaction = "✅"
				}
				s.MessageReactionAdd(m.ChannelID, m.ID, reaction)
			}
		case CommandTypeAdvanced:
			go HandleAdvancedCommand(s, m, c, args, stripped)
		}
	}
}

var noUseFuncRole = func(s *discordgo.Session, m *discordgo.MessageCreate) {
	s.ChannelMessageSend(m.ChannelID, fmt.Sprintf("**%s**, you can't use that!", m.Member.Nick))
}

var noUseFuncChannel = func(s *discordgo.Session, m *discordgo.MessageCreate) {
	s.ChannelMessageSend(m.ChannelID, fmt.Sprintf("**%s**, that command is disabled in this channel.", m.Member.Nick))
}

func HandleAdvancedCommand(s *discordgo.Session, m *discordgo.MessageCreate, c *Command, args []string, stripped string) {
	response := c.Responses[0]

	guild, _ := common.BotSession.State.Guild(m.GuildID)
	channel, _ := common.BotSession.State.GuildChannel(m.GuildID, m.ChannelID)
	member, _ := common.BotSession.State.Member(m.GuildID, m.Author.ID)
	t := templates.NewContext(guild, channel, member)
	t.Message = m.Message
	t.Data["Args"] = args
	t.Data["StrippedMsg"] = stripped

	defer func() {
		if err := recover(); err != nil {
			actualErr := ""
			switch t := err.(type) {
			case error:
				actualErr = t.Error()
			case string:
				actualErr = t
			}
			s.ChannelMessageSend(m.ChannelID, fmt.Sprintf("An error halted the execution of the custom command\n`%s`", actualErr))
		}
	}()

	t.Name = c.Name
	result, err := t.Execute(response)
	if err != nil {
		s.ChannelMessageSend(m.ChannelID, "Could not execute custom command: "+err.Error())
		return
	}

	s.ChannelMessageSend(m.ChannelID, result)
}

func HandleResponse(m *discordgo.MessageCreate, response string) string {
	var formatted string = response
OUTER:
	for i, c := range response {
		ch := fmt.Sprintf("%c", c)
		if ch == "{" { // Opening curly brace indicates start of expression
			var term int
			for j := i; j < len(response); j++ {
				p := fmt.Sprintf("%c", response[j])
				if p == "}" { // Terminator character found
					term = j
					break
				} else if j == len(response)-1 { // End of response, no success
					return formatted // Return as is
				}
			}

			// Handle substring
			substr := response[i+1 : term]
			points := strings.Split(substr, ".")
			params := make(map[int][]string)
			tree := make([]Node, len(points))
			for index, point := range points { // Set up tree
				var openStartIndex int = -1
				for i, c := range point { // Iterate over characters
					ch := fmt.Sprintf("%c", c)
					if ch == "(" {
						for j := i; j < len(point); j++ {
							p := fmt.Sprintf("%c", []rune(point)[j])
							if p == ")" {
								openStartIndex = i
								rawParams := point[openStartIndex+1 : j]
								split := strings.Split(rawParams, ",")
								for _, param := range split {
									param = strings.TrimSpace(param)
									params[index] = append(params[index], param)
								}
							}
						}
						break
					}
				}
				if openStartIndex != -1 {
					point = point[:openStartIndex]
				}

				if index == 0 {
					child, ok := nodes[point]
					if !ok {
						continue OUTER
					}
					tree[index] = child
					continue
				}
				child, ok := tree[index-1].Children[point]
				if !ok {
					continue OUTER
				}
				tree[index] = child
			}
			var result interface{}
			for index, node := range tree {
				if index == 0 {
					result = m
				}
				if node.Method == nil {
					if index == len(tree)-1 { // We have reached the end, forced to evaluate string value
						_, out := node.Evaluate(result)
						result = out
					} else {
						out, _ := node.Evaluate(result)
						result = out
					}
				} else {
					if index == len(tree)-1 { // We have reached the end, forced to evaluate method string value
						_, out, err := node.Method(result, params[index])
						if err != nil {
							if len(out) == 0 {
								continue OUTER
							} else {
								result = out
								break // Warning along the way blocks execution further down
							}
						}
						result = out
					} else {
						out, warn, err := node.Method(result, params[index])
						if err != nil {
							if len(warn) == 0 {
								continue OUTER
							} else {
								result = warn
								break // Warning along the way blocks execution further down
							}
						}
						result = out
					}
				}
			}

			formatted = strings.Replace(formatted, fmt.Sprintf("{%s}", substr), result.(string), 1)
		}
	}
	return formatted
}

var nodes = map[string]Node{
	"server": {
		Evaluate: func(m interface{}) (interface{}, string) {
			c := m.(*discordgo.MessageCreate)
			g := GetGuildCache(c.GuildID)
			return g, g.Name
		},
		Children: map[string]Node{
			"name": {
				Evaluate: func(m interface{}) (interface{}, string) {
					g := m.(*discordgo.Guild)
					return g.Name, g.Name
				},
			},
			"members": {
				Evaluate: func(m interface{}) (interface{}, string) {
					g := m.(*discordgo.Guild)
					return g, strconv.Itoa(len(g.Members))
				},
				Children: map[string]Node{
					"count": {
						Evaluate: func(m interface{}) (interface{}, string) {
							g := m.(*discordgo.Guild)
							return len(g.Members), strconv.Itoa(len(g.Members))
						},
						Children: intGroup,
					},
					"get": {
						Method: func(data interface{}, args []string) (interface{}, string, error) {
							if len(args) != 1 {
								return nil, "", errors.New("Incorrect parameters provided")
							}
							memberID := args[0]
							member, err := common.BotSession.State.Member(data.(*discordgo.Guild).ID, memberID)
							if err != nil {
								return nil, "INVALID MEMBER", errors.New("INVALID MEMBER")
							}
							return member, member.Nick, nil
						},
						Children: memberGroup,
					},
				},
			},
			"roles": {
				Evaluate: func(m interface{}) (interface{}, string) {
					g := m.(*discordgo.Guild)
					return g, strconv.Itoa(len(g.Roles))
				},
				Children: map[string]Node{
					"count": {
						Evaluate: func(m interface{}) (interface{}, string) {
							g := m.(*discordgo.Guild)
							return len(g.Roles), strconv.Itoa(len(g.Roles))
						},
						Children: intGroup,
					},
					"get": {
						Method: func(data interface{}, args []string) (interface{}, string, error) {
							if len(args) != 1 {
								return nil, "", errors.New("Incorrect parameters provided")
							}
							roleID := args[0]
							role, err := common.BotSession.State.Role(data.(*discordgo.Guild).ID, roleID)
							if err != nil {
								return nil, "INVALID ROLE", errors.New("INVALID ROLE")
							}
							return role, role.Name, nil
						},
						Children: roleGroup,
					},
				},
			},
		},
	},
	"user": { // User should be 'member' but it is shorter and more convenient
		Evaluate: func(m interface{}) (interface{}, string) {
			u := m.(*discordgo.MessageCreate)
			member, _ := common.BotSession.State.Member(u.GuildID, u.Author.ID)
			return member, member.Nick
		},
		Children: memberGroup,
	},
}

var intGroup = map[string]Node{
	"ordinal": {
		Evaluate: func(m interface{}) (interface{}, string) {
			end := m.(int) % 10
			switch end {
			case 1:
				return "1st", "1st"
			case 2:
				return "2nd", "2nd"
			case 3:
				return "3rd", "3rd"
			default:
				value := fmt.Sprintf("%vth", end)
				return value, value
			}
		},
	},
}

var memberGroup = map[string]Node{
	"nickname": {
		Evaluate: func(m interface{}) (interface{}, string) {
			u := m.(*discordgo.Member)
			return u.Nick, u.Nick
		},
	},
	"id": {
		Evaluate: func(m interface{}) (interface{}, string) {
			u := m.(*discordgo.Member)
			return u.User.ID, u.User.ID
		},
	},
	"username": {
		Evaluate: func(m interface{}) (interface{}, string) {
			u := m.(*discordgo.Member)
			return u.User.Username, u.User.Username
		},
	},
	"discriminator": {
		Evaluate: func(m interface{}) (interface{}, string) {
			u := m.(*discordgo.Member)
			return u.User.Discriminator, u.User.Username
		},
	},
	"tag": {
		Evaluate: func(m interface{}) (interface{}, string) {
			u := m.(*discordgo.Member)
			value := fmt.Sprintf("%s#%s", u.User.Username, u.User.Discriminator)
			return value, value
		},
	},
}

var roleGroup = map[string]Node{
	"name": {
		Evaluate: func(m interface{}) (interface{}, string) {
			r := m.(*discordgo.Role)
			return r.Name, r.Name
		},
	},
	"color": {
		Evaluate: func(m interface{}) (interface{}, string) {
			r := m.(*discordgo.Role)
			value := fmt.Sprintf("#%x", r.Color)
			return value, value
		},
	},
}

type Node struct {
	Evaluate func(interface{}) (interface{}, string)                  // Returns what to provide to children, and standalone evaluation
	Method   func(interface{}, []string) (interface{}, string, error) // ___, ___ + an error
	Children map[string]Node
}

func GetGuildCache(id string) *discordgo.Guild {
	guild, err := common.BotSession.State.Guild(id)
	if err != nil {
		return nil
	}
	return guild
}
