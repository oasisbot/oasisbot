package util

import "fmt"

const DomainURL = "localhost:3000"

func DashboardURL(guildID string) string {
	return fmt.Sprintf("http://%s/d/%s", DomainURL, guildID)
}

func URLToPlugin(guildID string, trail string) string {
	return fmt.Sprintf("http://%s/d/%s/%s", DomainURL, guildID, trail)
}
