package api

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"oasisbot/internal/common/endpoints"

	"github.com/bwmarrin/discordgo"
	"golang.org/x/oauth2"
)

func GetMe(r *http.Request) (*discordgo.User, error) {
	token := r.Context().Value("token").(*oauth2.Token)
	res, err := OauthConf.Client(oauth2.NoContext, token).Get(endpoints.EndpointDiscordAPIUsersMe)
	if err != nil || res.StatusCode != 200 {
		return nil, errors.New("Internal server error")
	}

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)
	var user discordgo.User
	json.Unmarshal(body, &user)
	return &user, nil
}

func GetMeGuilds(r *http.Request) (*[]discordgo.UserGuild, error) {
	token := r.Context().Value("token").(*oauth2.Token)
	res, err := OauthConf.Client(oauth2.NoContext, token).Get(endpoints.EndpointDiscordAPIUsersMeGuilds)
	if err != nil {
		return nil, errors.New("Internal server error")
	}

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)
	var guilds []discordgo.UserGuild
	json.Unmarshal(body, &guilds)
	return &guilds, nil
}

func GetGuild(r *http.Request) (*discordgo.Guild, error) {
	id := r.Context().Value("guildID")
	if id == nil {
		return nil, errors.New("No guildID provided for GetGuild()!")
	}

	return GetGuildByID(id.(string))
}

func GetGuildByID(id string) (*discordgo.Guild, error) {
	res, err := OauthConfBot.Client(oauth2.NoContext, BotToken).Get(endpoints.AppendToDiscordAPIGuild(id))
	if err != nil || res.StatusCode != 200 {
		return nil, err
	}

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)
	var guild discordgo.Guild
	err = json.Unmarshal(body, &guild)
	return &guild, nil
}
