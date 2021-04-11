package customcommands

import (
	"errors"
	"log"
	"oasisbot/internal/common"
	"regexp"
)

const pluginName = "custom_commands"

type Plugin struct{}

func (p *Plugin) GetName() string {
	return pluginName
}

func RegisterPlugin() {
	plugin := &Plugin{}
	common.RegisterPlugin(plugin)

	cache = make(map[string]map[string]*Command)
	commands, err := getAllCommands()
	if err != nil {
		log.Fatalln(err)
	}

	for _, c := range commands {
		if cache[c.GuildID] == nil {
			cache[c.GuildID] = make(map[string]*Command)
		}
		store := c // https://stackoverflow.com/questions/48826460/using-pointers-in-a-for-loop
		cache[c.GuildID][c.Name] = &store
	}
}

type CommandType int

const CommandTypeBasic = CommandType(0)
const CommandTypeRandomized = CommandType(1)
const CommandTypeRole = CommandType(3)
const CommandTypeAdvanced = CommandType(4)

type Command struct {
	GuildID           string      `bson:"guildID"`
	Name              string      `bson:"name"`
	Description       string      `bson:"description"`
	Enabled           bool        `bson:"enabled"`
	Type              CommandType `bson:"type"`
	Responses         []string    `bson:"responses"`
	AssignedRoles     []string    `bson:"assigned_roles"`
	AllowedRoles      []string    `bson:"allowed_roles"`
	ForbiddenRoles    []string    `bson:"forbidden_roles"`
	ForbiddenChannels []string    `bson:"forbidden_channels"`
}

const (
	MAX_COMMAND_NAME_LEN            = 32
	MAX_COMMAND_DESC_LEN            = 128
	MAX_COMMAND_RESP_LEN            = 2000
	MAX_COMMAND_RESP_COUNT          = 40
	MAX_COMMAND_ASSIGNED_ROLE_COUNT = 10
	REX_COMMAND_NAME                = `^[a-z0-9\-]+$`
)

// "guildID": { "commandName": value }
var cache map[string]map[string]*Command

func GetAllCommandsInGuild(id string) map[string]*Command {
	return cache[id]
}

func GetCommand(guildID string, name string) *Command {
	if command := cache[guildID][name]; command == nil {
		found, err := getCommand(guildID, name)
		if err != nil {
			return nil
		} else {
			AddCommand(guildID, found)
			return found
		}
	} else {
		return command
	}
}

func AddCommand(guildID string, command *Command) error {
	if cache[guildID] == nil {
		cache[guildID] = make(map[string]*Command)
	}

	if cache[guildID][command.Name] != nil {
		return errors.New("Trying to add command that already exists!")
	} else if err := addCommand(command); err != nil {
		return err
	}
	cache[guildID][command.Name] = command
	return nil
}

func UpdateCommand(guildID string, name string, command *Command) error {
	if cache[guildID] == nil {
		cache[guildID] = make(map[string]*Command)
	}

	if cache[guildID][name] == nil {
		return errors.New("Trying to update command that doesn't exist!")
	} else if err := updateCommand(name, command); err != nil {
		return err
	}

	cache[guildID][command.Name] = command
	if name != command.Name { // They updated the name of the command
		delete(cache[guildID], name)
	}
	return nil
}

func DeleteCommand(guildID string, name string) error {
	if cache[guildID] == nil || cache[guildID][name] == nil {
		return errors.New("Trying to delete command that doesn't exist!")
	} else {
		err := deleteCommand(guildID, name)
		if err == nil {
			delete(cache[guildID], name)
		}
		return err
	}
}

func ValidateCommand(guildID string, command *Command) bool {
	if command.GuildID != guildID {
		return false
	}
	if len(command.Name) > MAX_COMMAND_NAME_LEN || len(command.Description) > MAX_COMMAND_DESC_LEN {
		return false
	}
	if match, _ := regexp.MatchString(REX_COMMAND_NAME, command.Name); !match {
		return false
	}
	if command.Type < 0 || command.Type > 4 { // TODO: Change value to allow for other types
		return false
	}
	if command.Type != CommandTypeRole { // Role commands don't require a response
		for _, resp := range command.Responses {
			if len(resp) < 1 || len(resp) > MAX_COMMAND_RESP_LEN {
				return false
			}
		}
	}
	if len(command.AssignedRoles) > MAX_COMMAND_ASSIGNED_ROLE_COUNT || command.Type == CommandTypeRole && len(command.AssignedRoles) == 0 {
		return false
	}
	for _, assignedRole := range command.AssignedRoles {
		_, err := common.BotSession.State.Role(guildID, assignedRole)
		if err != nil {
			return false
		}
	}
	for _, allowedRole := range command.AllowedRoles {
		_, err := common.BotSession.State.Role(guildID, allowedRole)
		if err != nil {
			return false
		}
	}
	for _, forbiddenRole := range command.ForbiddenRoles {
		_, err := common.BotSession.State.Role(guildID, forbiddenRole)
		if err != nil {
			return false
		}
		for _, allowedRole := range command.AllowedRoles {
			if forbiddenRole == allowedRole {
				return false // No roles can be shared between the two
			}
		}
	}
	for _, forbiddenChannel := range command.ForbiddenChannels {
		_, err := common.BotSession.State.GuildChannel(guildID, forbiddenChannel)
		if err != nil {
			return false
		}
	}

	return true
}
