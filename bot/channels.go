package bot

import "oasisbot/common"

func ValidChannel(guildID string, channelID string) bool {
	_, err := common.BotSession.State.GuildChannel(guildID, channelID)
	return err == nil
}

func GetNameOfChannel(guildID string, channelID string) string {
	channel, err := common.BotSession.State.GuildChannel(guildID, channelID)
	if err != nil {
		return "Unknown"
	}
	return channel.Name
}