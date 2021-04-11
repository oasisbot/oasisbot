package util

import (
	"oasisbot/internal/cache"
	"oasisbot/internal/common"

	"github.com/bwmarrin/discordgo"
)

func HasPermission(guild *discordgo.Guild, m *discordgo.Member, p int) bool {
	for _, r := range m.Roles {
		role, _ := common.BotSession.State.Role(guild.ID, r)
		if role.Permissions&int64(p) == int64(p) {
			return true
		}
	}
	return false
}

// Returns whether or not member can modify guild, and their authority level if so
func CanModifyGuild(guild *discordgo.Guild, m *discordgo.Member, userID string) (bool, common.AuthorityLevel) {
	if userID == guild.OwnerID {
		return true, common.AuthorityLevelAll
	}
	if can := HasPermission(guild, m, discordgo.PermissionManageServer); can {
		return true, common.AuthorityLevelAll
	} else { // Fetch bot masters
		data, ok := cache.GuildData.Cache[guild.ID]
		if !ok {
			return false, common.AuthorityLevelNone
		}
		masters := data.Masters
		for _, r := range m.Roles {
			for _, mas := range masters {
				if r == mas {
					return true, common.AuthorityLevelLimited
				}
			}
		}
		return false, common.AuthorityLevelNone
	}
}

func BotHasPermission(guildID string, channelID string, perm int) bool {
	guild, err := common.BotSession.State.Guild(guildID)
	if err != nil {
		return false
	}
	return BotHasPermissionGuild(guild, channelID, perm)
}

func BotHasPermissionGuild(guild *discordgo.Guild, channelID string, perm int) bool {
	bot, err := common.BotSession.State.Member(guild.ID, common.BotSession.State.User.ID)
	if err != nil {
		return false
	}

	return HasPermission(guild, bot, perm)
}
