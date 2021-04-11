package eventsystem

import "github.com/bwmarrin/discordgo"

type Event int

const (
	EventAll                      Event = 0
	EventChannelCreate            Event = 8
	EventChannelDelete            Event = 9
	EventChannelPinsUpdate        Event = 10
	EventChannelUpdate            Event = 11
	EventConnect                  Event = 12
	EventDisconnect               Event = 13
	EventGuildBanAdd              Event = 14
	EventGuildBanRemove           Event = 15
	EventGuildCreate              Event = 16
	EventGuildDelete              Event = 17
	EventGuildEmojisUpdate        Event = 18
	EventGuildIntegrationsUpdate  Event = 19
	EventGuildMemberAdd           Event = 20
	EventGuildMemberRemove        Event = 21
	EventGuildMemberUpdate        Event = 22
	EventGuildMembersChunk        Event = 23
	EventGuildRoleCreate          Event = 24
	EventGuildRoleDelete          Event = 25
	EventGuildRoleUpdate          Event = 26
	EventGuildUpdate              Event = 27
	EventInvite                   Event = 28
	EventMessageAck               Event = 29
	EventMessageCreate            Event = 30
	EventMessageDelete            Event = 31
	EventMessageDeleteBulk        Event = 32
	EventMessageReactionAdd       Event = 33
	EventMessageReactionRemove    Event = 34
	EventMessageReactionRemoveAll Event = 35
	EventMessageUpdate            Event = 36
	EventPresenceUpdate           Event = 37
	EventPresencesReplace         Event = 38
	EventRateLimit                Event = 39
	EventReady                    Event = 40
	EventRelationshipAdd          Event = 41
	EventRelationshipRemove       Event = 42
	EventResumed                  Event = 43
	EventTypingStart              Event = 44
	EventUserGuildSettingsUpdate  Event = 45
	EventUserNoteUpdate           Event = 46
	EventUserSettingsUpdate       Event = 47
	EventUserUpdate               Event = 48
	EventVoiceServerUpdate        Event = 49
	EventVoiceStateUpdate         Event = 50
	EventWebhooksUpdate           Event = 51
	EventInteractionCreate        Event = 52
)

func (data *EventData) ChannelCreate() *discordgo.ChannelCreate {
	return data.Interface.(*discordgo.ChannelCreate)
}
func (data *EventData) ChannelDelete() *discordgo.ChannelDelete {
	return data.Interface.(*discordgo.ChannelDelete)
}
func (data *EventData) ChannelPinsUpdate() *discordgo.ChannelPinsUpdate {
	return data.Interface.(*discordgo.ChannelPinsUpdate)
}
func (data *EventData) ChannelUpdate() *discordgo.ChannelUpdate {
	return data.Interface.(*discordgo.ChannelUpdate)
}
func (data *EventData) Connect() *discordgo.Connect {
	return data.Interface.(*discordgo.Connect)
}
func (data *EventData) Disconnect() *discordgo.Disconnect {
	return data.Interface.(*discordgo.Disconnect)
}
func (data *EventData) GuildBanAdd() *discordgo.GuildBanAdd {
	return data.Interface.(*discordgo.GuildBanAdd)
}
func (data *EventData) GuildBanRemove() *discordgo.GuildBanRemove {
	return data.Interface.(*discordgo.GuildBanRemove)
}
func (data *EventData) GuildCreate() *discordgo.GuildCreate {
	return data.Interface.(*discordgo.GuildCreate)
}
func (data *EventData) GuildDelete() *discordgo.GuildDelete {
	return data.Interface.(*discordgo.GuildDelete)
}
func (data *EventData) GuildEmojisUpdate() *discordgo.GuildEmojisUpdate {
	return data.Interface.(*discordgo.GuildEmojisUpdate)
}
func (data *EventData) GuildIntegrationsUpdate() *discordgo.GuildIntegrationsUpdate {
	return data.Interface.(*discordgo.GuildIntegrationsUpdate)
}
func (data *EventData) GuildMemberAdd() *discordgo.GuildMemberAdd {
	return data.Interface.(*discordgo.GuildMemberAdd)
}
func (data *EventData) GuildMemberRemove() *discordgo.GuildMemberRemove {
	return data.Interface.(*discordgo.GuildMemberRemove)
}
func (data *EventData) GuildMemberUpdate() *discordgo.GuildMemberUpdate {
	return data.Interface.(*discordgo.GuildMemberUpdate)
}
func (data *EventData) GuildMembersChunk() *discordgo.GuildMembersChunk {
	return data.Interface.(*discordgo.GuildMembersChunk)
}
func (data *EventData) GuildRoleCreate() *discordgo.GuildRoleCreate {
	return data.Interface.(*discordgo.GuildRoleCreate)
}
func (data *EventData) GuildRoleDelete() *discordgo.GuildRoleDelete {
	return data.Interface.(*discordgo.GuildRoleDelete)
}
func (data *EventData) GuildRoleUpdate() *discordgo.GuildRoleUpdate {
	return data.Interface.(*discordgo.GuildRoleUpdate)
}
func (data *EventData) GuildUpdate() *discordgo.GuildUpdate {
	return data.Interface.(*discordgo.GuildUpdate)
}
func (data *EventData) Invite() *discordgo.Invite {
	return data.Interface.(*discordgo.Invite)
}
func (data *EventData) MessageAck() *discordgo.MessageAck {
	return data.Interface.(*discordgo.MessageAck)
}
func (data *EventData) MessageCreate() *discordgo.MessageCreate {
	return data.Interface.(*discordgo.MessageCreate)
}
func (data *EventData) MessageDelete() *discordgo.MessageDelete {
	return data.Interface.(*discordgo.MessageDelete)
}
func (data *EventData) MessageDeleteBulk() *discordgo.MessageDeleteBulk {
	return data.Interface.(*discordgo.MessageDeleteBulk)
}
func (data *EventData) MessageReactionAdd() *discordgo.MessageReactionAdd {
	return data.Interface.(*discordgo.MessageReactionAdd)
}
func (data *EventData) MessageReactionRemove() *discordgo.MessageReactionRemove {
	return data.Interface.(*discordgo.MessageReactionRemove)
}
func (data *EventData) MessageReactionRemoveAll() *discordgo.MessageReactionRemoveAll {
	return data.Interface.(*discordgo.MessageReactionRemoveAll)
}
func (data *EventData) MessageUpdate() *discordgo.MessageUpdate {
	return data.Interface.(*discordgo.MessageUpdate)
}
func (data *EventData) PresenceUpdate() *discordgo.PresenceUpdate {
	return data.Interface.(*discordgo.PresenceUpdate)
}
func (data *EventData) PresencesReplace() *discordgo.PresencesReplace {
	return data.Interface.(*discordgo.PresencesReplace)
}
func (data *EventData) RateLimit() *discordgo.RateLimit {
	return data.Interface.(*discordgo.RateLimit)
}
func (data *EventData) Ready() *discordgo.Ready {
	return data.Interface.(*discordgo.Ready)
}
func (data *EventData) RelationshipAdd() *discordgo.RelationshipAdd {
	return data.Interface.(*discordgo.RelationshipAdd)
}
func (data *EventData) RelationshipRemove() *discordgo.RelationshipRemove {
	return data.Interface.(*discordgo.RelationshipRemove)
}
func (data *EventData) Resumed() *discordgo.Resumed {
	return data.Interface.(*discordgo.Resumed)
}
func (data *EventData) TypingStart() *discordgo.TypingStart {
	return data.Interface.(*discordgo.TypingStart)
}
func (data *EventData) UserGuildSettingsUpdate() *discordgo.UserGuildSettingsUpdate {
	return data.Interface.(*discordgo.UserGuildSettingsUpdate)
}
func (data *EventData) UserNoteUpdate() *discordgo.UserNoteUpdate {
	return data.Interface.(*discordgo.UserNoteUpdate)
}
func (data *EventData) UserSettingsUpdate() *discordgo.UserSettingsUpdate {
	return data.Interface.(*discordgo.UserSettingsUpdate)
}
func (data *EventData) UserUpdate() *discordgo.UserUpdate {
	return data.Interface.(*discordgo.UserUpdate)
}
func (data *EventData) VoiceServerUpdate() *discordgo.VoiceServerUpdate {
	return data.Interface.(*discordgo.VoiceServerUpdate)
}
func (data *EventData) VoiceStateUpdate() *discordgo.VoiceStateUpdate {
	return data.Interface.(*discordgo.VoiceStateUpdate)
}
func (data *EventData) WebhooksUpdate() *discordgo.WebhooksUpdate {
	return data.Interface.(*discordgo.WebhooksUpdate)
}
func (data *EventData) InteractionCreate() *discordgo.InteractionCreate {
	return data.Interface.(*discordgo.InteractionCreate)
}

func fillEvent(e *EventData) {
	switch e.Interface.(type) {
	case *discordgo.ChannelCreate:
		e.Type = EventChannelCreate
	case *discordgo.ChannelDelete:
		e.Type = EventChannelDelete
	case *discordgo.ChannelPinsUpdate:
		e.Type = EventChannelPinsUpdate
	case *discordgo.ChannelUpdate:
		e.Type = EventChannelUpdate
	case *discordgo.Connect:
		e.Type = EventConnect
	case *discordgo.Disconnect:
		e.Type = EventDisconnect
	case *discordgo.GuildBanAdd:
		e.Type = EventGuildBanAdd
	case *discordgo.GuildBanRemove:
		e.Type = EventGuildBanRemove
	case *discordgo.GuildCreate:
		e.Type = EventGuildCreate
	case *discordgo.GuildDelete:
		e.Type = EventGuildDelete
	case *discordgo.GuildEmojisUpdate:
		e.Type = EventGuildEmojisUpdate
	case *discordgo.GuildIntegrationsUpdate:
		e.Type = EventGuildIntegrationsUpdate
	case *discordgo.GuildMemberAdd:
		e.Type = EventGuildMemberAdd
	case *discordgo.GuildMemberRemove:
		e.Type = EventGuildMemberRemove
	case *discordgo.GuildMemberUpdate:
		e.Type = EventGuildMemberUpdate
	case *discordgo.GuildMembersChunk:
		e.Type = EventGuildMembersChunk
	case *discordgo.GuildRoleCreate:
		e.Type = EventGuildRoleCreate
	case *discordgo.GuildRoleDelete:
		e.Type = EventGuildRoleDelete
	case *discordgo.GuildRoleUpdate:
		e.Type = EventGuildRoleUpdate
	case *discordgo.GuildUpdate:
		e.Type = EventGuildUpdate
	case *discordgo.Invite:
		e.Type = EventInvite
	case *discordgo.MessageAck:
		e.Type = EventMessageAck
	case *discordgo.MessageCreate:
		e.Type = EventMessageCreate
	case *discordgo.MessageDelete:
		e.Type = EventMessageDelete
	case *discordgo.MessageDeleteBulk:
		e.Type = EventMessageDeleteBulk
	case *discordgo.MessageReactionAdd:
		e.Type = EventMessageReactionAdd
	case *discordgo.MessageReactionRemove:
		e.Type = EventMessageReactionRemove
	case *discordgo.MessageReactionRemoveAll:
		e.Type = EventMessageReactionRemoveAll
	case *discordgo.MessageUpdate:
		e.Type = EventMessageUpdate
	case *discordgo.PresenceUpdate:
		e.Type = EventPresenceUpdate
	case *discordgo.PresencesReplace:
		e.Type = EventPresencesReplace
	case *discordgo.RateLimit:
		e.Type = EventRateLimit
	case *discordgo.Ready:
		e.Type = EventReady
	case *discordgo.RelationshipAdd:
		e.Type = EventRelationshipAdd
	case *discordgo.RelationshipRemove:
		e.Type = EventRelationshipRemove
	case *discordgo.Resumed:
		e.Type = EventResumed
	case *discordgo.TypingStart:
		e.Type = EventTypingStart
	case *discordgo.UserGuildSettingsUpdate:
		e.Type = EventUserGuildSettingsUpdate
	case *discordgo.UserNoteUpdate:
		e.Type = EventUserNoteUpdate
	case *discordgo.UserSettingsUpdate:
		e.Type = EventUserSettingsUpdate
	case *discordgo.UserUpdate:
		e.Type = EventUserUpdate
	case *discordgo.VoiceServerUpdate:
		e.Type = EventVoiceServerUpdate
	case *discordgo.VoiceStateUpdate:
		e.Type = EventVoiceStateUpdate
	case *discordgo.WebhooksUpdate:
		e.Type = EventWebhooksUpdate
	case *discordgo.InteractionCreate:
		e.Type = EventInteractionCreate
	default:
		e.Type = Event(-1)
	}
}
