package util

import (
	"fmt"
	"oasisbot/common/endpoints"
)

func DashboardURL(guildID string) string {
	return fmt.Sprintf("%s%s", endpoints.EndpointDashboardBase, guildID)
}

func URLToPlugin(guildID string, trail string) string {
	return fmt.Sprintf("%s%s/%s", endpoints.EndpointDashboardBase, guildID, trail)
}
