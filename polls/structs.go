package polls

type Poll struct {
	GuildID          string            `bson:"guild_id"`
	ChannelID        string            `bson:"channel_id"`
	MessageID        string            `bson:"message_id"`
	Content          string            `bson:"content"`
	ReactionMessages []ReactionMessage `bson:"reaction_messages"`
	EndsAt           int64             `bson:"ends_at"`
}

type FrontendLanding struct {
	NextPollCycle int64
	Polls         []FrontendPollPreview
}

type ReactionData struct {
	Emoji string
	Users int
}

type ReactionMessage struct {
	Emoji   string `bson:"emoji"`
	Message string `bson:"message"`
}

type FrontendPollPreview struct {
	ID        string
	ChannelID string
	// First 100 characters of the message or less
	MessagePreview string
	// Whether or not the message fits in 100 chars
	IsFullMessage bool
	Reactions     []ReactionData
	EndsAt        int64
}

type PollCreate struct {
	ChannelID        string
	Content          string
	Reactions        []ReactionData
	ReactionMessages []ReactionMessage
	EndsAt           int64
}
