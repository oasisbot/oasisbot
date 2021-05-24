package bcx

import (
	"oasisbot/common"
	"oasisbot/util"

	"github.com/bwmarrin/discordgo"
)

var Dashboard = Command{
	Name:          "dashboard",
	Description:   "Provides a link to this server's dashboard",
	Aliases:       []string{"dash"},
	PermEvaluator: permEvaluator,
	Handler:       dashboard,
}

func dashboard(s *discordgo.Session, m *discordgo.MessageCreate, args []string) {
	s.ChannelMessageSend(m.ChannelID, "Here's your dashboard! "+util.DashboardURL(m.GuildID))
}

func permEvaluator(s *discordgo.Session, m *discordgo.MessageCreate) bool {
	guild, _ := common.BotSession.Guild(m.GuildID)
	canModify, _ := util.CanModifyGuild(guild, m.Member, m.Author.ID)
	return canModify
}
