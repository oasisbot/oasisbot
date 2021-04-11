import React from 'react'
import { Avatar } from '@material-ui/core'
import { Guild, GuildPreview } from '../protocol'

export interface GuildIconProps {
    guild: Guild | GuildPreview
    className?: string | undefined
    style?: React.CSSProperties | undefined
}

export default function GuildIcon ({guild, style = undefined, className = undefined}: GuildIconProps) {
    return (
        guild.Icon ? 
        <Avatar className={className} style={style} src={`https://cdn.discordapp.com/icons/${guild.ID}/${guild.Icon}`}/> :
        <Avatar className={className} style={style}>{guild.Name.charAt(0).toUpperCase()}</Avatar>
    )
}