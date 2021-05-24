package bot

import (
	"log"
	bcx "oasisbot/bot/commands"
	"oasisbot/common"
	"oasisbot/common/endpoints"

	"github.com/bwmarrin/discordgo"
)

var (
	slashCommandsGlobal string
	slashCommandsGuild  string
)

func InitSlashCommands() {
	slashCommandsGlobal = endpoints.EndpointGlobalSlashCommands(common.ConfClientID.GetString())
	slashCommandsGuild = endpoints.EndpointGuildSlashCommands(common.ConfClientID.GetString(), common.ConfDeveloperServerID.GetString())
}

func RegisterSlashCommand(name string, description string, args []bcx.CommandArg) {
	var options []*discordgo.ApplicationCommandOption
	for _, arg := range args {
		option := &discordgo.ApplicationCommandOption{
			Name:        arg.Name,
			Description: arg.Description,
			Type:        arg.Type,
			Required:    arg.Required,
		}
		options = append(options, option)
	}
	command := &discordgo.ApplicationCommand{
		Name:        name,
		Description: description,
		Options:     options,
	}

	_, err := common.BotSession.ApplicationCommandCreate(common.BotSession.State.User.ID, common.ConfDeveloperServerID.GetString(), command)
	if err != nil {
		log.Fatalln(err)
	}
}
