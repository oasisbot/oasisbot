package polls

type Poll struct {
	GuildID   string `bson:"guild_id"`
	ChannelID string `bson:"channel_id"`
	MessageID string `bson:"message_id"`
	EndsAt    int64  `bson:"ends_at"`
}

type FrontendPoll struct {
	ChannelName string `bson:"channel"`
	// First 100 characters of the message or less
	MessagePreview string `bson:"message_preview"`
	// Whether or not the message fits in 100 chars
	FullMessage bool  `bson:"full_message"`
	EndsAt      int64 `bson:"ends_at"`
}

type PollCreate struct {
	ChannelID string `json:"channel_id"`
	Message   string `json:"message"`
	EndsAt    int64  `bson:"ends_at"`
}