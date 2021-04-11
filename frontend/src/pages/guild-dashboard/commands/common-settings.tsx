import React from 'react'
import ChannelDisplay from '../../../components/channel-display';
import RoleDisplay from '../../../components/role-display';
import { Channel, Role } from '../../../protocol';

export interface CommonSettingsProps {
    rolePool: Role[]
    allowedRoles: Role[]
    forbiddenRoles: Role[]
    channelPool: Channel[]
    forbiddenChannels: Channel[]
    onAllowedRolesUpdate: (roles: Role[]) => void
    onForbiddenRolesUpdate: (roles: Role[]) => void
    onForbiddenChannelsUpdate: (channels: Channel[]) => void
}

export default function CommonSettings ({ 
    rolePool, 
    allowedRoles, 
    forbiddenRoles, 
    channelPool, 
    forbiddenChannels, 
    onAllowedRolesUpdate, 
    onForbiddenRolesUpdate,
    onForbiddenChannelsUpdate }: CommonSettingsProps) {
    return (
        <>
            <h4 style={{color: '#bbbbbb', marginBottom: '0'}}>ALLOWED ROLES</h4>
            <p style={{color: '#cccccc', marginBottom: '10px'}}>Only members with these roles are allowed to use the command.
            Defaults to no roles, which is equivalent to adding @everyone.</p>
            <RoleDisplay variant='add' roles={allowedRoles} onRolesUpdate={onAllowedRolesUpdate} allRoles={rolePool}/>
            <h4 style={{color: '#bbbbbb', marginBottom: '0'}}>FORBIDDEN ROLES</h4>
            <p style={{color: '#cccccc', marginBottom: '10px'}}>Members with these roles are not allowed to use the command.</p>
            <RoleDisplay variant='add' roles={forbiddenRoles} onRolesUpdate={onForbiddenRolesUpdate} allRoles={rolePool}/>
            <h4 style={{color: '#bbbbbb', marginBottom: '0'}}>FORBIDDEN CHANNELS</h4>
            <p style={{color: '#cccccc', marginBottom: '0px'}}>The command can not be used in these channels.</p>
            <ChannelDisplay channels={forbiddenChannels} onChannelsUpdate={onForbiddenChannelsUpdate} allChannels={channelPool}/>
        </>
    )
}