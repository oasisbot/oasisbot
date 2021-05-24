package tools

import (
	"oasisbot/common"
	"oasisbot/util"
	"sync"

	"github.com/bwmarrin/discordgo"
)

var MessageDeleteQueue = &messageDeleteQueue{
	channels: make(map[string]*messageDeleteQueueChannel),
}

type messageDeleteQueue struct {
	sync.RWMutex
	channels map[string]*messageDeleteQueueChannel
}

func (q *messageDeleteQueue) DeleteMessages(guildID string, channel string, msgIDs ...string) {
	q.Lock()
	defer q.Unlock()
	if channelQueue, ok := q.channels[channel]; ok {
		channelQueue.Lock()
		if !channelQueue.Exiting {
			for _, msgID := range msgIDs {
				if !isInStringSlice(channelQueue.Processing, msgID) && !isInStringSlice(channelQueue.Queued, msgID) {
					channelQueue.Queued = append(channelQueue.Queued, msgID)
				}
			}

			channelQueue.Unlock()
			q.Unlock()
			return
		}
	}

	if guildID != "" {
		if !util.BotHasPermission(guildID, channel, discordgo.PermissionManageMessages) {
			q.Unlock()
			return
		}
	}

	cq := &messageDeleteQueueChannel{
		Parent:  q,
		Channel: channel,
		Queued:  msgIDs,
	}
	q.channels[channel] = cq
	go cq.run()
}

func isInStringSlice(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

type messageDeleteQueueChannel struct {
	sync.RWMutex

	Parent *messageDeleteQueue

	Channel string
	Exiting bool

	Queued     []string
	Processing []string
}

func (cq *messageDeleteQueueChannel) run() {
	for {
		cq.Lock()
		cq.Processing = nil

		if len(cq.Queued) < 1 {
			cq.Exiting = true

			cq.Unlock()
			cq.Parent.Lock()
			if cq.Parent.channels[cq.Channel] == cq {
				delete(cq.Parent.channels, cq.Channel)
			}

			cq.Parent.Unlock()
			return
		}

		if len(cq.Queued) < 100 {
			cq.Processing = cq.Queued
			cq.Queued = nil
		} else {
			cq.Processing = cq.Queued[:99]
			cq.Queued = cq.Queued[99:]
		}

		cq.Unlock()
		cq.process(cq.Processing)
	}
}

func (cq *messageDeleteQueueChannel) process(ids []string) {
	if len(ids) == 1 {
		// Use standard ChannelMessageDelete
		common.BotSession.ChannelMessageDelete(cq.Channel, ids[0])
	} else {
		// Delete the messages in bulk
		common.BotSession.ChannelMessagesBulkDelete(cq.Channel, ids)
	}
}
