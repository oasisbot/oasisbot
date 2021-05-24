package polls

import (
	"fmt"
	"oasisbot/common"

	"github.com/bwmarrin/discordgo"
)

func sendPollMessage(channelID string, content string, reactions []string) (string, error) {
	msgSend := &discordgo.MessageSend{
		Embed: &discordgo.MessageEmbed{
			Title: "Poll",
			Description: content,
		},
	}
	msg, err := common.BotSession.ChannelMessageSendComplex(channelID, msgSend)
	if err == nil {
		for _, reaction := range reactions {
			common.BotSession.MessageReactionAdd(channelID, msg.ID, reaction)
		}
		return msg.ID, nil
	}
	return "", err
}

func endPoll(channelID string, messageID string) {
	message, err := common.BotSession.ChannelMessage(channelID, messageID)
	if err != nil {
		return
	}
	if len(message.Embeds) < 1 {
		return
	}
	embed := message.Embeds[0]
	msgEdit := &discordgo.MessageEdit{
		Channel: channelID,
		ID: messageID,
		Embed: &discordgo.MessageEmbed{
			Title: embed.Title + " [ENDED]",
			Description: embed.Description,
		},
	}
	common.BotSession.ChannelMessageEditComplex(msgEdit)

	tally := make(map[string]int)
	for _, reaction := range message.Reactions {
		if _, ok := tally[reaction.Emoji.ID]; ok {
			tally[reaction.Emoji.Name]++
		} else {
			tally[reaction.Emoji.Name] = 1
		}
	}

	var formatted string
	for name, count := range tally {
		text := "members"
		if count == 1 {
			text = "member"
		}
		formatted += fmt.Sprintf("%s **%v %s**\n", name, count, text)
	}

	msgSend := &discordgo.MessageSend{
		Embed: &discordgo.MessageEmbed{
			Title: "Results",
			Description: formatted,
		},
	}
	common.BotSession.ChannelMessageSendComplex(channelID, msgSend)
}