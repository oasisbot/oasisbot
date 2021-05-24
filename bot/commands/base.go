package bcx

import "github.com/bwmarrin/discordgo"

type CommandHandlerFunc func(s *discordgo.Session, m *discordgo.MessageCreate, args []string)
type SlashCommandHandlerFunc func(s *discordgo.Session, i *discordgo.InteractionCreate)

type Command struct {
	// The name of the command
	Name string
	// The description of the command
	Description string
	// Aliases that can be used to call this command, these are not included in slash commands
	Aliases []string
	// Arguments that are displayed in help embeds, or options in slash commands
	Arguments []CommandArg
	// Array of Discord permissions all of which are needed in a member to use the command
	Permissions []int
	// Function that overrides the permissions that evualuates if a member can use the command
	PermEvaluator func(s *discordgo.Session, m *discordgo.MessageCreate) bool
	// Function that is run when the command is executed successfully
	Handler CommandHandlerFunc
	// Function that is run when an interaction is created, if provided, this command is also registered as a slash command
	SlashHandler SlashCommandHandlerFunc
	// Function that is called when the command is registered
	OnRegister func()
}

type CommandArg struct {
	// The name of this argument
	Name string
	// The description of this argument
	Description string
	// Whether this argument is required or not
	Required bool
	// Type is only valid for slash commands, this can be ommited if not part of a slash command
	Type discordgo.ApplicationCommandOptionType
}
