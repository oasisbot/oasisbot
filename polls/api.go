package polls

import (
	"fmt"
	"oasisbot/bot"
)

func CreateFrontendLanding(polls map[string]*Poll) FrontendLanding {
	var frontendPolls []FrontendPollPreview
	for _, poll := range polls {
		frontendPolls = append(frontendPolls, poll.ToFrontend())
	}
	return FrontendLanding{
		NextPollCycle: NextCycleTimestamp(),
		Polls: frontendPolls,
	}
}

func (p *Poll) ToFrontend() FrontendPollPreview {
	channelName := bot.GetNameOfChannel(p.GuildID, p.ChannelID)
	messageContent := bot.GetMessageEmbedDescription(p.ChannelID, p.MessageID)
	reactions, _ := bot.GetMessageReactions(p.ChannelID, p.MessageID)
	fullMessage := len(messageContent) <= 100
	for _, reaction := range reactions {
		fmt.Println(*reaction.Emoji)
	}

	frontendReactions := make([]ReactionData, len(reactions))
	for i, reaction := range reactions {
		frontendReactions[i] = ReactionData{
			Emoji: reaction.Emoji.Name,
			Users: reaction.Count,
		}
	}
	
	if !fullMessage {
		messageContent = messageContent[0:101]
	}

	return FrontendPollPreview{
		ChannelName: channelName,
		MessagePreview: messageContent,
		IsFullMessage: fullMessage,
		Reactions: frontendReactions,
		EndsAt: p.EndsAt,
	}
}