package polls

import (
	"fmt"
	"oasisbot/common"
	colors "oasisbot/common/colors"
	"oasisbot/common/templates"
	"strings"

	"github.com/bwmarrin/discordgo"
)

func sendPollMessage(channelID string, content string, reactions []string) (string, error) {
	msgSend := &discordgo.MessageSend{
		Embed: &discordgo.MessageEmbed{
			Title:       "Poll",
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

func endPollImpl(poll *Poll) {
	message, err := common.BotSession.ChannelMessage(poll.ChannelID, poll.MessageID)
	if err != nil {
		return
	}
	if len(message.Embeds) < 1 {
		return
	}
	embed := message.Embeds[0]
	msgEdit := &discordgo.MessageEdit{
		Channel: poll.ChannelID,
		ID:      poll.MessageID,
		Embed: &discordgo.MessageEmbed{
			Title:       embed.Title + " [ENDED]",
			Description: embed.Description,
			Color:       colors.RED,
		},
	}
	common.BotSession.ChannelMessageEditComplex(msgEdit)

	filteredReactions := filterByAllowedReactions(message.Reactions, poll.ReactionMessages)
	tally := make(map[string]int)
	for _, reaction := range filteredReactions {
		tally[reaction.Emoji.Name] = reaction.Count - 1
	}

	var reactions []ReactionData
	var tie bool

	for key, value := range tally {
		reactions = append(reactions, ReactionData{Emoji: key, Users: value})
	}

	best := reactions[0]
	for _, reaction := range reactions {
		if reaction.Users > best.Users {
			best = reaction
		}
	}
	if multipleOccurrences(reactions, best.Users) {
		tie = true
	}

	response, _ := findReactionMessage(best.Emoji, poll.ReactionMessages)
	if tie || strings.TrimSpace(response) == "" {
		var resultsString string
		for name, count := range tally {
			text := "members"
			if count == 1 {
				text = "member"
			}
			resultsString += fmt.Sprintf("%s ➜ **%v** %s\n", name, count, text)
		}

		var previewString string
		if len(embed.Description) > 100 {
			previewString += embed.Description[0:101]
			previewString += "..."
		} else {
			previewString += embed.Description
		}

		formatted := fmt.Sprintf("*%s*\n\nResults:\n%s", previewString, resultsString)

		msgSend := &discordgo.MessageSend{
			Embed: &discordgo.MessageEmbed{
				Title:       "Poll Results",
				Description: formatted,
			},
		}
		common.BotSession.ChannelMessageSendComplex(poll.ChannelID, msgSend)
	} else {
		var final string
		if err != nil {
			final = response
			goto Send
		}
		{
			var context = make(map[string]interface{})
			for name, count := range tally {
				context[name] = count
			}
			final = templates.ParseAndExecuteSimple(response, "[", "]", context)
		}

	Send:

		msgSend := &discordgo.MessageSend{
			Embed: &discordgo.MessageEmbed{
				Title:       "Poll Results",
				Description: final,
			},
		}
		common.BotSession.ChannelMessageSendComplex(poll.ChannelID, msgSend)
	}
}
