export interface User {
	ID: string
	Username: string
	Avatar: string
}

export interface GuildPreview {
	ID: string
	Name: string
	Icon: string
	HasBot: boolean
}

export interface Overwrite {
	id: string
	type: number
	allow: string
	deny: string
}

export interface Role {
	color: number
	hoist: boolean
	id: string
	managed: boolean
	mentionable: boolean
	name: string
	permissions: string
	position: number
}

export interface Channel {
	id: string
	type: number
	guild_id: string
	position: number
	permission_overwrites: Overwrite[]
	name: string
	topic: string
	nswf: string
	// Some properties are left out because they will never be used
	parent_id: string
}

export interface Guild {
	ID: string
	Name: string
	Icon: string
	Prefix: string
	Masters: string[]
	Roles: Role[]
	Channels: Channel[]
	AuthorityLevel: number
}

export interface Command {
	GuildID: string
	Name: string
	Description: string
	Enabled: boolean
	Type: number
	Responses: string[]
	AssignedRoles: string[]
	AllowedRoles: string[]
	ForbiddenRoles: string[]
	ForbiddenChannels: string[]
}

export interface SettingsReq {
	BotMasters: string[]
	Prefix: string
}
