package polls

import (
	"oasisbot/internal/common"
	"time"

	"oasisbot/internal/logs"

	"github.com/carlescere/scheduler"
)

const pluginName = "polls"

type Plugin struct{}

func (p *Plugin) GetName() string {
	return pluginName
}

var (
	cache map[string]*Poll
	logger = logs.PluginLogger(&Plugin{})
)

func RegisterPlugin() {
	plugin := &Plugin{}
	common.RegisterPlugin(plugin)

	polls, err := getAllPolls()
	if err != nil {
		logger.Fatalln(err)
	}
	cache = make(map[string]*Poll)
	for _, poll := range polls {
		cache[poll.MessageID] = poll
	}

	runLoop()
}

func runLoop() {
	config := common.ConfPluginPollInterval.GetInt()
	logger.Println("Poll interval started, cycle every", config, "(seconds)")

	cycle := func() {
		for _, poll := range cache {
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

	scheduler.Every(config).Seconds().Run(cycle)
}

func NewPoll(channelID string, content string, endTimestamp int64, reactions []string) error {
	result := make(chan error)
	go func() {
		msgID, err := sendPollMessage(channelID, content, reactions)
		if err != nil {
			result <- err
		}
		poll := &Poll{
			ChannelID: channelID,
			MessageID: msgID,
			EndsAt: endTimestamp,
		}
		if err := addPoll(poll); err == nil {
			cache[poll.MessageID] = poll
		}
		result <- nil
	}()
	return <- result
}