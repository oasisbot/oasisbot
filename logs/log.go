package logs

import (
	"oasisbot/common"

	log "github.com/sirupsen/logrus"
)

const (
	KeyBot = "BOT"
	KeyWeb = "WEB"
)

func PluginLogger(plugin common.Plugin) *log.Entry {
	name := plugin.GetName()
	return log.WithField("plugin", name)
}
