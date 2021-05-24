package polls

import (
	"oasisbot/common"
	"time"

	"oasisbot/logs"

	"github.com/carlescere/scheduler"
)

const pluginName = "polls"

type Plugin struct{}

func (p *Plugin) GetName() string {
	return pluginName
}

var (
	cache map[string]map[string]*Poll
	pollLimit int
	logger = logs.PluginLogger(&Plugin{})
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
		cache[poll.GuildID][poll.MessageID] = poll
	}

	pollLimit = common.ConfPluginPollsGuildPollLimit.GetInt()

	runLoop()
}

func runLoop() {
	config := common.ConfPluginPollsInterval.GetInt()
	logger.Println("Poll interval started, cycle every", config, "(seconds)")

	cycle := func() {
		for _, guild := range cache {
			for _, poll := range guild {
				now := time.Now().UTC().Unix()
				if now > poll.EndsAt {
					err := deletePoll(poll.MessageID)
					if err == nil {
						delete(cache, poll.MessageID)
						endPoll(poll.ChannelID, poll.MessageID)
					}
				}
			}
		}
	}

	scheduler.Every(config).Seconds().Run(cycle)
}

func NewPoll(guildID string, channelID string, content string, endTimestamp int64, reactions []string) error {
	result := make(chan error)
	go func() {
		msgID, err := sendPollMessage(channelID, content, reactions)
		if err != nil {
			result <- err
		}
		poll := &Poll{
			GuildID: guildID,
			ChannelID: channelID,
			MessageID: msgID,
			EndsAt: endTimestamp,
		}
		if err := addPoll(poll); err == nil {
			cache[poll.GuildID][poll.MessageID] = poll
		}
		result <- nil
	}()
	return <- result
}

func ValidPoll(poll *Poll) bool {
	
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