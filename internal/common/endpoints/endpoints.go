package endpoints

import (
	"fmt"
	"oasisbot/internal/common"
)

var (
	APIVersion         = "v8"
	EndpointDiscord    = "https://discord.com"
	EndpointDiscordAPI = AppendToDiscord(fmt.Sprintf("/api/%s", APIVersion))

	EndpointDiscordOauth2Authorize = AppendToDiscordAPI("/oauth2/authorize")
	EndpointDiscordAPIOauth2Token  = AppendToDiscordAPI("/oauth2/token")
	EndpointDiscordAPIApplications = AppendToDiscordAPI("/applications")

	EndpointDiscordAPIUsersMe       = AppendToDiscordAPI("/users/@me")
	EndpointDiscordAPIUsersMeGuilds = AppendToDiscordAPI("/users/@me/guilds")
	EndpointDiscordAPIGuild         = AppendToDiscordAPI("/guilds")
)

var (
	EndpointAuthCallback string
	EndpointGuildOauth   string
)

func SetupEndpoints() {
	EndpointAuthCallback = AppendToDomain("/auth/callback")
	EndpointGuildOauth = AppendToDomain("/guild-oauth")
}

func AppendToDiscord(path string) string {
	return fmt.Sprintf("%s%s", EndpointDiscord, path)
}
func AppendToDiscordAPI(path string) string {
	return fmt.Sprintf("%s%s", EndpointDiscordAPI, path)
}
func AppendToDiscordAPIApplications(path string) string {
	return fmt.Sprintf("%s%s", EndpointDiscordAPIApplications, path)
}
func AppendToDiscordAPIGuild(path string) string {
	return fmt.Sprintf("%s%s", EndpointDiscordAPIGuild, path)
}

func AppendToDomain(path string) string {
	return fmt.Sprintf("%s%s", common.ConfDomain.GetString(), path)
}
