package common

import (
	"github.com/bwmarrin/discordgo"
)

var BotSession *discordgo.Session

type UserSend struct {
	ID       string
	Username string
	Avatar   string
}

func CreateUser(id string, username string, avatar string) *UserSend {
	return &UserSend{
		ID:       id,
		Username: username,
		Avatar:   avatar,
	}
}

type GuildPreviewSend struct {
	ID     string
	Name   string
	Icon   string
	HasBot bool
}

func GlobalOnMessage(next func(*discordgo.Session, *discordgo.MessageCreate)) func(*discordgo.Session, *discordgo.MessageCreate) {
	return func(s *discordgo.Session, m *discordgo.MessageCreate) {
		if len(m.GuildID) == 0 {
			return // OasisBot does not support DM's
		}
		if m.Author.ID == s.State.User.ID { // Ignore all messages sent by the bot itself
			return
		} else if m.Author.Bot {
			return
		}
		next(s, m)
	}
}

func CreatePreviewGuild(id string, name string, icon string, hasBot bool) GuildPreviewSend {
	return GuildPreviewSend{
		ID:     id,
		Name:   name,
		Icon:   icon,
		HasBot: hasBot,
	}
}

type Guild struct {
	GuildID string   `bson:"guildID"`
	Masters []string `bson:"masters"`
	Prefix  string   `bson:"prefix"`
}

type GuildSend struct {
	ID       string
	Name     string
	Icon     string
	Prefix   string
	Masters  []string
	Roles    []discordgo.Role
	Channels []discordgo.Channel
	// Describes whether the user has limited access (0) or full access (1) to guild's dashboard
	AuthorityLevel AuthorityLevel
}

type SettingsRequest struct {
	BotMasters []string
	Prefix     string
}

func ValidateSettings(guildID string, s *SettingsRequest) bool {
	for _, role := range s.BotMasters {
		r, err := BotSession.State.Role(guildID, role)
		if err != nil {
			return false
		}
		if r.Permissions&discordgo.PermissionManageServer == discordgo.PermissionManageServer {
			return false // Redundant role
		}
	}
	if len(s.Prefix) > 1 {
		return false
	}

	return true
}
