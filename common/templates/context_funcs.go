package templates

import (
	"errors"
	"fmt"
	"oasisbot/common"
	"strconv"
	"strings"

	"github.com/bwmarrin/discordgo"
)

var (
	ErrTooManyCalls = errors.New("Too many calls!")
	ErrChannelNF    = errors.New("Channel not found!")
	ErrMemberNF     = errors.New("Member not found!")
	ErrRoleNF       = func(name string) error {
		return errors.New(fmt.Sprintf("Role %s not found!", name))
	}
	ErrTemplateNF                 = errors.New("Template not found!")
	ErrCannotUseTemplateRecursion = errors.New("Cannot use sendTemplate in a sendTemplate call!")
	ErrNoRoleSpecified            = errors.New("No role specified!")
)

func (c *Context) sendMessage(returnID bool) func(channel interface{}, message interface{}) interface{} {
	return func(channel interface{}, message interface{}) interface{} {
		parseMentions := []discordgo.AllowedMentionType{discordgo.AllowedMentionTypeUsers}
		msgSend := &discordgo.MessageSend{
			AllowedMentions: &discordgo.MessageAllowedMentions{
				Parse: parseMentions,
			},
		}

		cid := c.ChannelArg(channel)
		if cid == "" {
			return ""
		}

		switch typed := message.(type) {
		case *discordgo.MessageEmbed:
			msgSend.Embed = typed
		case *discordgo.MessageSend:
			typed.AllowedMentions = msgSend.AllowedMentions
			msgSend = typed
		default:
			msgSend.Content = fmt.Sprint(message)
		}

		res, err := common.BotSession.ChannelMessageSendComplex(cid, msgSend)
		if err == nil && returnID {
			return res.ID
		}
		return ""
	}
}

func (c *Context) sendTemplate(returnID bool) func(channel interface{}, name string, data ...interface{}) (interface{}, error) {
	return func(channel interface{}, name string, data ...interface{}) (interface{}, error) {
		if c.IncCounter("nested_calls", 3) {
			return "", ErrTooManyCalls
		}
		if c.CurrentRun.nested {
			return "", ErrCannotUseTemplateRecursion
		}
		t := c.CurrentRun.parsedTemplate.Lookup(name)
		if t == nil {
			return "", ErrTemplateNF
		}
		cid := c.ChannelArg(channel)
		if cid == "" {
			return "", ErrTemplateNF
		}

		c.CurrentRun.parsedTemplate = t
		res, err := c.executeParsed()
		if err != nil {
			return "", err
		}

		msg, err := common.BotSession.ChannelMessageSendComplex(cid, &discordgo.MessageSend{Content: res})
		if err == nil && returnID {
			return msg.ID, nil
		}
		return "", nil
	}
}

func (c *Context) editMessage(channel interface{}, messageID interface{}, message interface{}) (interface{}, error) {
	cid := c.ChannelArg(channel)
	if cid == "" {
		return nil, ErrChannelNF
	}

	msgID := ToString(messageID)
	msgEdit := &discordgo.MessageEdit{
		ID:      msgID,
		Channel: cid,
	}

	switch typedMessage := message.(type) {
	case *discordgo.MessageEmbed:
		msgEdit.Embed = typedMessage
	case *discordgo.MessageEdit:
		msgEdit.Content = typedMessage.Content
		msgEdit.Embed = typedMessage.Embed
	default:
		formatted := fmt.Sprint(message)
		msgEdit.Content = &formatted
	}

	common.BotSession.ChannelMessageEditComplex(msgEdit)

	return "", nil
}

func (c *Context) deleteMessage(channel interface{}, messageID interface{}, args ...interface{}) string {
	cid := c.ChannelArg(channel)
	if cid == "" {
		return ""
	}
	msgID := ToString(messageID)
	delay := 10
	if len(args) > 0 {
		delay = int(ToInt64(args[0]))
	}
	if delay > 60 {
		delay = 60
	}
	DeleteMessage(c.Guild.ID, cid, msgID, delay)
	return ""
}

func (c *Context) getRole(roleID interface{}) interface{} {
	sRoleID := RoleIDArg(roleID)
	role, err := common.BotSession.State.Role(c.Guild.ID, sRoleID)
	if err != nil || role == nil {
		return nil
	}
	return *role
}

func (c *Context) getMember(userID interface{}) interface{} {
	uid := UserIDArg(userID)
	member, err := common.BotSession.State.Member(c.Guild.ID, uid)
	if err != nil || member == nil {
		return nil
	}
	return *member
}

func (c *Context) getChannel(channelID interface{}) interface{} {
	cid := c.ChannelArg(channelID)
	if cid == "" {
		return nil
	}
	channel, err := common.BotSession.State.GuildChannel(c.Guild.ID, cid)
	if err != nil {
		return nil
	}
	return channel
}

func (c *Context) hasRoleID(roleID interface{}) bool {
	role := RoleIDArg(roleID)
	if role == "" {
		return false
	}

	for _, r := range c.Member.Roles {
		if r == role {
			return true
		}
	}
	return false
}

func (c *Context) hasRoleName(roleName string) bool {
	for _, role := range c.Guild.Roles {
		if strings.EqualFold(role.Name, roleName) {
			for _, memRole := range c.Member.Roles {
				if role.Name == memRole {
					return true
				}
			}
			return false
		}
	}
	return false
}

func (c *Context) targetHasRoleID(target interface{}, roleID interface{}) bool {
	userID := UserIDArg(target)
	member, err := common.BotSession.State.Member(c.Guild.ID, userID)
	if err != nil {
		return false
	}

	var role string
	switch roleID.(type) {
	case int:
		role = strconv.Itoa(roleID.(int))
	case string:
		role = roleID.(string)
	default:
		return false
	}

	for _, r := range member.Roles {
		if r == role {
			return true
		}
	}
	return false
}

func (c *Context) targetHasRoleName(target interface{}, roleName string) bool {
	userID := UserIDArg(target)
	member, err := common.BotSession.State.Member(c.Guild.ID, userID)
	if err != nil {
		return false
	}

	for _, role := range c.Guild.Roles {
		if strings.EqualFold(role.Name, roleName) {
			for _, memRole := range member.Roles {
				if role.Name == memRole {
					return true
				}
			}
			return false
		}
	}
	return false
}

func (c *Context) addRoleID(roleID interface{}) (string, error) {
	sroleID := ToString(roleID)
	if sroleID == "" {
		return "", ErrNoRoleSpecified
	}
	err := common.BotSession.GuildMemberRoleAdd(c.Guild.ID, c.Member.User.ID, sroleID)
	if err != nil {
		return "", err
	}
	return "", nil
}

func (c *Context) addRoleName(roleName string) (string, error) {
	roleID := ""
	for _, role := range c.Guild.Roles {
		if strings.EqualFold(role.Name, roleName) {
			roleID = role.ID
			break
		}
	}
	if roleID == "" {
		return "", ErrRoleNF(roleName)
	}
	err := common.BotSession.GuildMemberRoleAdd(c.Guild.ID, c.Member.User.ID, roleID)
	if err != nil {
		return "", err
	}
	return "", nil
}

func (c *Context) targetAddRoleID(target interface{}, roleID interface{}) (string, error) {
	userID := UserIDArg(target)
	role := ToString(roleID)
	if userID == "" || role == "" {
		return "", nil
	}

	hasRole := false
	member, err := common.BotSession.State.Member(c.Guild.ID, userID)
	if err == nil && member != nil {
		for _, r := range member.Roles {
			if r == role {
				hasRole = true
				break
			}
		}
	} else {
		return "", ErrMemberNF
	}

	if !hasRole {
		err := common.BotSession.GuildMemberRoleAdd(c.Guild.ID, userID, role)
		if err != nil {
			return "", err
		}
	}

	return "", nil
}

func (c *Context) targetAddRoleName(target interface{}, roleName string) (string, error) {
	userID := UserIDArg(target)
	role := c.findRoleByName(roleName)
	if role == nil {
		return "", ErrRoleNF(roleName)
	}
	hasRole := false
	member, err := common.BotSession.State.Member(c.Guild.ID, userID)
	if err == nil && member != nil {
		for _, r := range member.Roles {
			if r == role.ID {
				hasRole = true
				break
			}
		}
	} else {
		return "", ErrMemberNF
	}
	if !hasRole {
		return "", common.BotSession.GuildMemberRoleAdd(c.Guild.ID, userID, role.ID)
	}

	return "", nil
}

func (c *Context) removeRoleID(roleID interface{}) (string, error) {
	sroleID := ToString(roleID)
	if sroleID == "" {
		return "", ErrNoRoleSpecified
	}
	err := common.BotSession.GuildMemberRoleRemove(c.Guild.ID, c.Member.User.ID, sroleID)
	if err != nil {
		return "", err
	}
	return "", nil
}

func (c *Context) removeRoleName(roleName string) (string, error) {
	roleID := ""
	for _, role := range c.Guild.Roles {
		if strings.EqualFold(role.Name, roleName) {
			roleID = role.ID
			break
		}
	}
	if roleID == "" {
		return "", ErrRoleNF(roleName)
	}
	err := common.BotSession.GuildMemberRoleRemove(c.Guild.ID, c.Member.User.ID, roleID)
	if err != nil {
		return "", err
	}
	return "", nil
}

func (c *Context) targetRemoveRoleID(target interface{}, roleID interface{}) (string, error) {
	userID := UserIDArg(target)
	role := ToString(roleID)
	if userID == "" || role == "" {
		return "", nil
	}

	hasRole := false
	member, err := common.BotSession.State.Member(c.Guild.ID, userID)
	if err == nil && member != nil {
		for _, r := range member.Roles {
			if r == role {
				hasRole = true
				break
			}
		}
	} else {
		return "", ErrMemberNF
	}

	if hasRole {
		err := common.BotSession.GuildMemberRoleRemove(c.Guild.ID, userID, role)
		if err != nil {
			return "", err
		}
	}

	return "", nil
}

func (c *Context) targetRemoveRoleName(target interface{}, roleName string) (string, error) {
	userID := UserIDArg(target)
	role := c.findRoleByName(roleName)
	if role == nil {
		return "", ErrRoleNF(roleName)
	}
	hasRole := false
	member, err := common.BotSession.State.Member(c.Guild.ID, userID)
	if err == nil && member != nil {
		for _, r := range member.Roles {
			if r == role.ID {
				hasRole = true
				break
			}
		}
	} else {
		return "", ErrMemberNF
	}
	if hasRole {
		return "", common.BotSession.GuildMemberRoleRemove(c.Guild.ID, userID, role.ID)
	}

	return "", nil
}

func (c *Context) findRoleByName(name string) *discordgo.Role {
	for _, r := range c.Guild.Roles {
		if strings.EqualFold(r.Name, name) {
			return r
		}
	}
	return nil
}

func RoleIDArg(roleID interface{}) string {
	var role string
	switch roleID.(type) {
	case int:
		role = strconv.Itoa(roleID.(int))
	case int64:
		role = strconv.FormatInt(roleID.(int64), 10)
	case string:
		role = roleID.(string)
	}
	return role
}

func UserIDArg(userID interface{}) string {
	switch t := userID.(type) {
	case *discordgo.User:
		return t.ID
	case string:
		s := strings.TrimSpace(t)
		if strings.HasPrefix(s, "<@") && strings.HasSuffix(s, ">") && len(s) > 4 {
			k := s[2 : len(s)-1]
			if k[0] == '!' {
				k = k[1:]
			}
			s = k
		}
		return s
	default:
		return ToString(userID)
	}
}

func (c *Context) ChannelArg(v interface{}) string {
	if v == nil && c.CurrentRun.channel != nil {
		return c.CurrentRun.channel.ID
	} else if v == nil {
		return ""
	}

	var result string
	switch t := v.(type) {
	case int:
		result = strconv.Itoa(t)
	case int64:
		result = strconv.FormatInt(t, 10)
	case string:
		isInt := false
		if _, err := strconv.Atoi(t); err == nil {
			isInt = true
			result = t
		}
		if !isInt { // Channel name specified or something else
			for _, ch := range c.Guild.Channels {
				if strings.EqualFold(t, ch.Name) && ch.Type == discordgo.ChannelTypeGuildText {
					return ch.ID
				}
			}
		}
	}

	for _, ch := range c.Guild.Channels {
		if ch.ID == result {
			return result
		}
	}

	return ""
}
