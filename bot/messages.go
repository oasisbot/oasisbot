package bot

import (
	"fmt"
	"oasisbot/common"

	"github.com/bwmarrin/discordgo"
)


func GetMessageEmbedDescription(channelID string, messageID string) string {
	message, err := common.BotSession.ChannelMessage(channelID, messageID)
	if err != nil {
		fmt.Println(err)
		return "No content"
	}
	if len(message.Embeds) < 1 {
		return "No content"
	}
	
	content := message.Embeds[0].Description
	return content
}

func GetMessageReactions(channelID string, messageID string) ([]*discordgo.MessageReactions, error) {
	message, err := common.BotSession.ChannelMessage(channelID, messageID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return message.Reactions, nil
}