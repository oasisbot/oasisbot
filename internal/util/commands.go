package util

import "oasisbot/internal/cache"

func GetPrefix(guildID string) string {
	guild, err := cache.GuildData.Fetch(guildID, false)
	if err == nil {
		return guild.Prefix
	}
	return "&"
}
