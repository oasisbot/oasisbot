package bot

import (
	"fmt"
	"log"
	bcx "oasisbot/bot/commands"
	eventsystem "oasisbot/bot/events"
	"oasisbot/common"
	"oasisbot/util"
	"strings"

	"github.com/bwmarrin/discordgo"
)

func Init() {
	CreateBot()
	RegisterCommand(bcx.Help)
	RegisterCommand(bcx.Dashboard)

	InitSlashCommands()

	common.BotSession.AddHandler(func(s *discordgo.Session, m interface{}) {
		eventsystem.HandleEvent(s, m)
	})

	RegisterMainEvents()
}

func RegisterMainEvents() {
	eventsystem.AddHandler(eventsystem.EventMessageCreate, onMessage)
	eventsystem.AddHandler(eventsystem.EventInteractionCreate, onInteractionCreate)
}

func CreateBot() {
	dg, err := discordgo.New(fmt.Sprintf("Bot %s", common.ConfBotToken.GetString()))
	if err != nil {
		log.Fatalln(err)
	}
	// Set up intents
	dg.Identify.Intents = discordgo.MakeIntent(discordgo.IntentsAll)
	if err := dg.Open(); err != nil {
		log.Fatalln(err)
	}
	common.BotSession = dg
}

func Run() {
	for _, plugin := range common.Plugins {
		if botInit, ok := plugin.(BotInitHandler); ok {
			botInit.BotInit()
		}
	}
}

func onMessage(e *eventsystem.EventData) {
	s := e.Session
	m := e.MessageCreate()
	if len(e.MessageCreate().GuildID) == 0 {
		return // OasisBot does not support DM's
	}
	if m.Author.ID == s.State.User.ID { // Ignore all messages sent by the bot itself
		return
	} else if m.Author.Bot {
		return
	}

	prefix := util.GetPrefix(m.GuildID)
	if strings.HasPrefix(m.Content, prefix) {
		HandleCommand(s, m)
	}
}

func onInteractionCreate(e *eventsystem.EventData) {
	s := e.Session
	i := e.InteractionCreate()
	if i.Member.User.ID == s.State.User.ID {
		return
	}
	if i.Member.User.Bot {
		return
	}

	HandleSlashCommand(s, i)
}

type BotInitHandler interface {
	BotInit()
}
