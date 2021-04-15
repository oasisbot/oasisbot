package polls

type Poll struct {
	ChannelID string `bson:"channel_id"`
	MessageID string `bson:"message_id"`
	EndsAt    int64  `bson:"ends_at"`
}