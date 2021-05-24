package api

import (
	"oasisbot/common"
	"oasisbot/common/endpoints"

	"golang.org/x/oauth2"
)

var OauthConf *oauth2.Config
var OauthConfBot *oauth2.Config
var BotToken *oauth2.Token

func Create() {
	OauthConf = &oauth2.Config{
		RedirectURL:  endpoints.EndpointAuthCallback,
		ClientID:     common.ConfClientID.GetString(),
		ClientSecret: common.ConfClientSecret.GetString(),
		Scopes:       []string{"identify", "email", "guilds"},
		Endpoint: oauth2.Endpoint{
			AuthURL:   endpoints.EndpointDiscordOauth2Authorize,
			TokenURL:  endpoints.EndpointDiscordAPIOauth2Token,
			AuthStyle: oauth2.AuthStyleInParams,
		},
	}

	OauthConfBot = &oauth2.Config{
		RedirectURL:  endpoints.EndpointGuildOauth,
		ClientID:     common.ConfClientID.GetString(),
		ClientSecret: common.ConfClientSecret.GetString(),
		Scopes:       []string{"identify", "bot", "email", "guilds"},
		Endpoint: oauth2.Endpoint{
			AuthURL:   endpoints.EndpointDiscordOauth2Authorize,
			TokenURL:  endpoints.EndpointDiscordAPIOauth2Token,
			AuthStyle: oauth2.AuthStyleInParams,
		},
	}

	BotToken = &oauth2.Token{
		AccessToken:  common.ConfBotToken.GetString(),
		TokenType:    "Bot",
		RefreshToken: "",
	}
}
