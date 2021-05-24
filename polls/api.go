package polls

import (
	"oasisbot/bot"
)


func (p *Poll) ToFrontend() *FrontendPoll {
	channelName := bot.GetNameOfChannel(p.GuildID, p.ChannelID)
	messageContent := bot.GetMessageContent(p.ChannelID, p.MessageID)
	fullMessage := len(messageContent) <= 100
	
	if !fullMessage {
		messageContent = messageContent[0:101]
	}

	return &FrontendPoll{
		ChannelName: channelName,
		MessagePreview: messageContent,
		FullMessage: fullMessage,
		EndsAt: p.EndsAt,
	}
}