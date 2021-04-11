package bcx

import (
	"fmt"
	"oasisbot/internal/common"
	"oasisbot/internal/customcommands"
	"oasisbot/internal/util"
	"strings"

	"github.com/bwmarrin/discordgo"
)

var Help = Command{
	Name:        "help",
	Description: "Displays info about all commands or one specific command",
	Aliases:     nil,
	Handler:     help,
	OnRegister:  onRegister,
}

var categories map[string]func(*discordgo.Session, *discordgo.MessageCreate)

func help(s *discordgo.Session, m *discordgo.MessageCreate, args []string) {
	prefix := util.GetPrefix(m.GuildID)
	if len(args) == 0 {
		s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
			Title: "Help",
			Description: strings.ReplaceAll(`
			**%%help commands**
			Get help with custom commands!`, "%%", prefix),
			Color: 5032432,
		})
	} else { // Test category or specific command
		if cat, ok := categories[args[0]]; ok {
			cat(s, m)
		}
	}
}

func onRegister() {
	categories = make(map[string]func(*discordgo.Session, *discordgo.MessageCreate))
	categories["commands"] = func(s *discordgo.Session, m *discordgo.MessageCreate) {
		prefix := util.GetPrefix(m.GuildID)
		var commandOutput string
		commands := customcommands.GetAllCommandsInGuild(m.GuildID)
		for name, c := range commands {
			if !c.Enabled {
				continue
			}
			var desc string
			if len(c.Description) > 0 {
				desc = c.Description
			} else {
				desc = "No description provided"
			}
			commandOutput += fmt.Sprintf("`%s%s`\n%s\n\n", prefix, name, desc)
		}
		if len(commandOutput) == 0 {
			commandOutput = "No commands to display\n\n"
		}

		guild, _ := common.BotSession.State.Guild(m.GuildID)
		if canModify, _ := util.CanModifyGuild(guild, m.Member, m.Author.ID); canModify {
			s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
				Title: "Commands Plugin",
				Thumbnail: &discordgo.MessageEmbedThumbnail{
					URL:    "https://ik.imagekit.io/ic7z7ov2ibc/assets/dYruo6_6FsWzNgWs5.png",
					Width:  32,
					Height: 32,
				},
				Description: commandOutput + fmt.Sprintf("[`[edit]`](%s)", util.URLToPlugin(guild.ID, "commands")),
				Color:       5032432,
			})
		} else {
			s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
				Title:       "Commands Plugin",
				Description: commandOutput,
				Color:       5032432,
			})
		}
	}
}
