package polls

import (
	"oasisbot/bot"
	"oasisbot/common"
	"time"

	"oasisbot/logs"

	"github.com/carlescere/scheduler"
	emoji "github.com/tmdvs/Go-Emoji-Utils"
)

const pluginName = "polls"

type Plugin struct{}

func (p *Plugin) GetName() string {
	return pluginName
}

var (
	cache map[string]map[string]*Poll
	interval int
	pollLimit int
	logger = logs.PluginLogger(&Plugin{})
	lastCycleTimestamp int64
)

func RegisterPlugin() {
	plugin := &Plugin{}
	common.RegisterPlugin(plugin)

	polls, err := getAllPolls()
	if err != nil {
		logger.Fatalln(err)
	}
	cache = make(map[string]map[string]*Poll)
	for _, poll := range polls {
		addPollToCache(poll)
	}

	pollLimit = common.ConfPluginPollsGuildPollLimit.GetInt()
	interval = common.ConfPluginPollsInterval.GetInt()

	runLoop()
}

func runLoop() {
	logger.Println("Poll interval started, cycle every", interval, "(seconds)")
	didCycle := func() {
		lastCycleTimestamp = time.Now().UTC().Unix()
	}

	didCycle()
	cycle := func() {
		for _, guild := range cache {
			for _, poll := range guild {
				now := time.Now().UTC().Unix()
				if now > poll.EndsAt {
					err := deletePoll(poll.MessageID)
					if err == nil {
						deletePollFromCache(poll)
						endPoll(poll.ChannelID, poll.MessageID)
					}
				}
			}
		}

		didCycle()
	}

	scheduler.Every(interval).Seconds().Run(cycle)
}

func NewPoll(guildID string, channelID string, content string, reactionMessages []ReactionMessage, endTimestamp int64, reactions []string) error {
	result := make(chan error)
	go func() {
		msgID, err := sendPollMessage(channelID, content, reactions)
		if err != nil {
			result <- err
			return
		}
		poll := &Poll{
			GuildID: guildID,
			ChannelID: channelID,
			MessageID: msgID,
			ReactionMessages: reactionMessages,
			EndsAt: endTimestamp,
		}
		if err := addPoll(poll); err == nil {
			addPollToCache(poll)
		}
		result <- nil
	}()
	return <- result
}

func ValidPoll(guildID string, poll *PollCreate) bool {
	if !bot.ValidChannel(guildID, poll.ChannelID) {
		return false
	}
	if len(poll.Content) > 1000 {
		return false
	}
	for _, reaction := range poll.Reactions {
		_, err := emoji.LookupEmoji(reaction.Emoji)
		if err != nil && !containsString(unicodeExpressions, reaction.Emoji) {
			return false
		}
	}
	if duplicateReactions(poll.Reactions) {
		return false
	}
	for _, reactionMessage := range poll.ReactionMessages {
		if !containsReaction(poll.Reactions, reactionMessage.Emoji) {
			return false
		}
		if len(reactionMessage.Message) > 1000 {
			return false
		}
	}
	if poll.EndsAt < time.Now().UTC().Unix() {
		return false
	}
	if poll.EndsAt > time.Now().UTC().AddDate(0, 6, 0).Unix() {
		return false
	}

	return true
}

// CACHE OPERATIONS

func addPollToCache(poll *Poll) {
	if cache[poll.GuildID] == nil {
		cache[poll.GuildID] = make(map[string]*Poll)
	}
	cache[poll.GuildID][poll.MessageID] = poll
}

func deletePollFromCache(poll *Poll) {
	delete(cache[poll.GuildID], poll.MessageID)
}

// END

func reactionsToStrings(reactions []ReactionData) []string {
	strings := make([]string, len(reactions))
	for i, reaction := range reactions {
		strings[i] = reaction.Emoji
	}
	return strings
}

func GetAllPollsInGuild(guildID string) map[string]*Poll {
	return cache[guildID]
}

func CanCreatePoll(guildID string) bool { 
	polls := cache[guildID]
	if len(polls) < pollLimit {
		return true
	}
	return false
}

func NextCycleTimestamp() int64 {
	return lastCycleTimestamp + int64(interval)
}

func containsReaction(reactions []ReactionData, emoji string) bool {
	for _, r := range reactions {
		if r.Emoji == emoji {
			return true
		}
	}

	return false
}

func containsString(strings []string, s string) bool {
	for _, str := range strings {
		if str == s {
			return true
		}
	}

	return false
}

func duplicateReactions(reactions []ReactionData) bool {
	visited := make(map[ReactionData]bool, 0)
   	for _, reaction := range reactions {
      	if visited[reaction] == true{
         	return true
      	} else {
         	visited[reaction] = true
      	}
   	}
   	return false
}