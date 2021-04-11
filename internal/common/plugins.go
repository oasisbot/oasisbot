package common

import "log"

var Plugins []Plugin

type Plugin interface {
	GetName() string
}

func RegisterPlugin(p Plugin) {
	Plugins = append(Plugins, p)
	log.Println("Registered plugin", p.GetName())
}
