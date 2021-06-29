package polls

import (
	"oasisbot/bot"
	"sync"
)

var (
	reactionCache = make(map[string][]ReactionData)
	mutex         = sync.Mutex{}
)

func updateReactionCache(poll *Poll) {
	mutex.Lock()
	defer mutex.Unlock()

	if reactionCache[poll.MessageID] == nil {
		var array []ReactionData
		reactionCache[poll.MessageID] = array
	}
	rawReactions, _ := bot.GetMessageReactions(poll.ChannelID, poll.MessageID)
	filteredReactions := filterByAllowedReactions(rawReactions, poll.ReactionMessages)
	reactions := make([]ReactionData, len(filteredReactions))
	for i, reaction := range filteredReactions {
		reactions[i] = ReactionData{
			Emoji: reaction.Emoji.Name,
			Users: reaction.Count,
		}
	}

	reactionCache[poll.MessageID] = reactions
}

func getReactionsForPoll(poll *Poll) []ReactionData {
	mutex.Lock()
	defer mutex.Unlock()

	if reactionCache[poll.MessageID] == nil {
		var reactions []ReactionData
		for _, rm := range poll.ReactionMessages {
			reactions = append(reactions, ReactionData{rm.Emoji, 0})
		}
		return reactions
	}
	return realReactions(reactionCache[poll.MessageID])
}

func realReactions(raw []ReactionData) []ReactionData {
	var real []ReactionData
	for _, r := range raw {
		real = append(real, ReactionData{r.Emoji, r.Users - 1})
	}
	return real
}
