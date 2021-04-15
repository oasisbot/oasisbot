package customcommands

type CommandType int

const CommandTypeBasic = CommandType(0)
const CommandTypeRandomized = CommandType(1)
const CommandTypeRole = CommandType(3)
const CommandTypeAdvanced = CommandType(4)

type Command struct {
	GuildID           string      `bson:"guild_id"`
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