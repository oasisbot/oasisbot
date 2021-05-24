package endpoints

import "fmt"

var (
	rawGlobalSlashCommands = AppendToDiscordAPIApplications("/%s/commands")
	rawGuildSlashCommands  = AppendToDiscordAPIApplications("/%s/guilds/%s/commands")
)

func EndpointGlobalSlashCommands(clientID string) string {
	return fmt.Sprintf(rawGlobalSlashCommands, clientID)
}
func EndpointGuildSlashCommands(clientID, guildID string) string {
	return fmt.Sprintf(rawGuildSlashCommands, clientID, guildID)
}
