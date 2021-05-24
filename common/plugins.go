package common

import (
	log "github.com/sirupsen/logrus"
)

var Plugins []Plugin

type Plugin interface {
	GetName() string
}

func RegisterPlugin(p Plugin) {
	Plugins = append(Plugins, p)
	log.Info("Registered plugin ", p.GetName())
}
