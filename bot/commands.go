package bot

import (
	"fmt"
	"log"
	bcx "oasisbot/bot/commands"
	"oasisbot/common"
	"oasisbot/util"
	"strings"

	"github.com/bwmarrin/discordgo"
)

var Commands map[string]*bcx.Command

func init() {
	Commands = make(map[string]*bcx.Command)
}

func RegisterCommand(c bcx.Command) {
	if Commands[c.Name] != nil {
		log.Fatalln(fmt.Sprintf("Registering duplicate command '%s'!", c.Name))
	}
	Commands[c.Name] = &c
	for _, alias := range c.Aliases {
		if Commands[alias] != nil {
			log.Fatalln(fmt.Sprintf("Registering command alias '%s' that already exists!", alias))
		}
		Commands[alias] = &c
	}
	if c.OnRegister != nil {
		c.OnRegister()
	}
}

func HandleCommand(s *discordgo.Session, m *discordgo.MessageCreate) {
	fields := strings.Fields(m.Content)
	if f := Commands[fields[0][1:]]; f != nil {
		if f.Permissions != nil {
			guild, _ := common.BotSession.State.Guild(m.GuildID)
			for _, p := range f.Permissions {
				if !util.HasPermission(guild, m.Member, p) {
					noUseFunc(s, m)
					return
				}
			}
		} else if f.PermEvaluator != nil {
			result := f.PermEvaluator(s, m)
			if !result {
				noUseFunc(s, m)
				return
			}
		}

		f.Handler(s, m, fields[1:])
	}
}

func HandleSlashCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {
	if c := Commands[i.Data.Name]; c != nil {
		if c.SlashHandler == nil {
			return
		}
		if c.Permissions != nil {
			guild, _ := common.BotSession.State.Guild(i.GuildID)
			for _, p := range c.Permissions {
				if !util.HasPermission(guild, i.Member, p) {
					noUseFuncSlash(s, i)
					return
				}
			}
		}

		c.SlashHandler(s, i)
	}
}

var noUseFunc = func(s *discordgo.Session, m *discordgo.MessageCreate) {
	s.ChannelMessageSend(m.ChannelID, fmt.Sprintf("**%s**, you can't use that!", m.Member.Nick))
}

var noUseFuncSlash = func(s *discordgo.Session, i *discordgo.InteractionCreate) {
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionApplicationCommandResponseData{
			Flags:   1 << 6,
			Content: fmt.Sprintf("**%s**, you can't use that!", i.Member.Nick),
		},
	})
}
