package util

import "oasisbot/guilds"

func GetPrefix(guildID string) string {
	guild, err := guilds.GuildData.Fetch(guildID, false)
	if err == nil {
		return guild.Prefix
	}
	return "&"
}
