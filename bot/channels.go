package bot

import "oasisbot/common"

func GetNameOfChannel(guildID string, channelID string) string {
	channel, err := common.BotSession.State.GuildChannel(guildID, channelID)
	if err != nil {
		return "Unknown"
	}
	return channel.Name
}