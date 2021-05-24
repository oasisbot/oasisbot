package eventsystem

import (
	"github.com/bwmarrin/discordgo"
)

var handlers map[Event][]HandlerFunc

type HandlerFunc func(e *EventData)

type EventData struct {
	Interface interface{}
	Session   *discordgo.Session
	Type      Event
}

func init() {
	handlers = make(map[Event][]HandlerFunc)
}

func AddHandler(event Event, handler HandlerFunc) {
	handlers[event] = append(handlers[event], handler)
}

func HandleEvent(s *discordgo.Session, m interface{}) {
	event := &EventData{
		Interface: m,
		Session:   s,
	}
	fillEvent(event)
	if handlers, ok := handlers[event.Type]; ok {
		for _, handler := range handlers {
			handler(event)
		}
	}
}
