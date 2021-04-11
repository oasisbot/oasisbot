package common

import (
	"oasisbot/internal/common/config"
	"strings"

	"github.com/pkg/errors"
)

var (
	ConfOwner        *config.Option
	ConfClientID     *config.Option
	ConfClientSecret *config.Option
	ConfBotToken     *config.Option
	ConfMongoDBURI   *config.Option

	ConfDomain            *config.Option
	ConfDeveloperServerID *config.Option
)

var loaded = false

func RegisterOptions() {
	ConfOwner = config.RegisterOption("oasisbot.bot_owner", "The owner ID of the bot", "")
	ConfClientID = config.RegisterOption("oasisbot.client_id", "The client ID of the bot application", nil)
	ConfClientSecret = config.RegisterOption("oasisbot.client_secret", "The client secret of the bot application", nil)
	ConfBotToken = config.RegisterOption("oasisbot.bot_token", "The bot token of the bot", nil)
	ConfMongoDBURI = config.RegisterOption("oasisbot.mongodb_uri", "The URI to the MongoDB database", nil)

	ConfDomain = config.RegisterOption("oasisbot.domain", "The domain of the website for the bot", "")
	ConfDeveloperServerID = config.RegisterOption("oasisbot.developer_server_id", "The ID for the main developer server", "")
}

func LoadConfig() error {
	if loaded {
		return nil
	}
	loaded = true

	config.AddSource(&config.EnvSource{})
	config.LoadAll()

	required := []*config.Option{
		ConfClientID,
		ConfClientSecret,
		ConfBotToken,
		ConfMongoDBURI,
		ConfDomain,
	}

	for _, opt := range required {
		if opt.Value == nil {
			envFormat := strings.ToUpper(strings.Replace(opt.Name, ".", "_", -1))
			return errors.Errorf("Required config option %q not specified (%s as environment variable)", opt.Name, envFormat)
		}
	}

	return nil
}
