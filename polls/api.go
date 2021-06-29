package polls

func CreateFrontendLanding(polls map[string]*Poll) FrontendLanding {
	var frontendPolls []FrontendPollPreview
	for _, poll := range polls {
		frontendPolls = append(frontendPolls, poll.ToFrontend())
	}
	return FrontendLanding{
		NextPollCycle: NextCycleTimestamp(),
		Polls:         frontendPolls,
	}
}

func (p *Poll) ToFrontend() FrontendPollPreview {
	messageContent := p.Content
	fullMessage := len(messageContent) <= 100
	reactions := getReactionsForPoll(p)

	if !fullMessage {
		messageContent = messageContent[0:101]
	}

	return FrontendPollPreview{
		ID:             p.MessageID,
		ChannelID:      p.ChannelID,
		MessagePreview: messageContent,
		IsFullMessage:  fullMessage,
		Reactions:      reactions,
		EndsAt:         p.EndsAt,
	}
}
