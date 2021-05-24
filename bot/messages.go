package bot

import "oasisbot/common"

func GetMessageContent(channelID string, messageID string) string {
	message, err := common.BotSession.State.Message(channelID, messageID)
	if err != nil {
		return "No content"
	}
	return message.Content
}