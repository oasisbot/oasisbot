import React from 'react'
import useStateWithCallback from 'use-state-with-callback'

import { makeStyles, createStyles, Theme } from '@material-ui/core'
import RoleDisplay from '../../components/role-display'
import { Guild, Role, SettingsReq } from '../../protocol'

import LockIcon from '@material-ui/icons/Lock';
import Info from '../../components/info';
import { LightOrDarkColorNum } from '../../common';
import SaveChangesBar from '../../components/save-changes-bar';
import Input from '../../components/input';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        settings: {
            display: 'flex',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 20px',
            flexFlow: 'column',
            '& h4': {
                color: '#dddddd',
                margin: 0
            },
            '& p': {
                color: '#cccccc'
            },
        },
    })
)

export interface SettingsProps {
    guild: Guild
    onSave: (settings: SettingsReq) => void
}

export default function Settings ({ guild, onSave }: SettingsProps) {
    const classes = useStyles()

    const [hasChanges, setHasChanges] = React.useState(false)
    const [botMasterRoles, setBotMasterRoles] = useStateWithCallback(guild.Masters ? guild.Roles.filter(x => guild.Masters.includes(x.id)) : [], () => checkIfChanges())
    const [prefix, setPrefix] = useStateWithCallback(guild.Prefix, () => checkIfChanges())

    React.useEffect(() => {
        checkIfChanges()
    }, [guild])

    const checkIfChanges = () => {
        if (JSON.stringify(botMasterRoles.map(x => x.id)) !== JSON.stringify((guild.Masters || []))
        || prefix !== guild.Prefix) setHasChanges(true)
        else setHasChanges(false) 
    }

    const onChangesCancel = () => {
        setBotMasterRoles(guild.Masters ? guild.Roles.filter(x => guild.Masters.includes(x.id)) : []) // Default values
        setPrefix(guild.Prefix)
    }

    const handlePrefixUpdate = (prefix: string) => {
        if (prefix.length > 1) return
        setPrefix(prefix)
    }

    return (
        <div className={classes.settings}>
            <div style={{marginTop: '20px'}}/>
            <h3 style={{marginBottom: '0'}}>BOT MASTERS</h3>
            <Info style={{margin: '15px 0 40px 0'}}>
                <p>
                    Bot Masters can view and edit all configurable items in your dashboard. Learn more about Bot Masters <a 
                    href='https://docs.oasisbot.xyz/dashboard-and-permissions#bot-masters'style={{color: '#4cc9f0'}}>here</a>
                </p>
            </Info>
            <div style={{display: 'flex', flexFlow: 'row', alignItems: 'center'}}>
                <h4>MANAGE SERVER ROLES</h4>
                <LockIcon style={{width: '15px', height: '15px', color: '#dddddd', marginLeft: '3px'}}/>
            </div>
            <p>These roles have the <b>Manage Server</b> permission, and by default members with these roles can view the dashboard.</p>
            <RoleDisplay 
            variant='disabled' 
            roles={guild.Roles.filter(r => (parseInt(r.permissions)&0x0000020) == 0x0000020)}
            />
            <h4 style={{marginTop: '20px'}}>ADDITIONAL BOT MASTERS</h4>
            <p>Members with these roles are also considered bot masters, however they do not need to have the manage server permission.</p>
            <RoleDisplay 
            variant={guild.AuthorityLevel > 0 ? 'add' : 'disabled'} 
            roles={botMasterRoles} 
            allRoles={guild.Roles.filter(r => (parseInt(r.permissions)&0x0000020) != 0x0000020)} 
            onRolesUpdate={(roles) => setBotMasterRoles(roles)}
            />
            <h3 style={{marginTop: '40px'}}>COMMANDS</h3>
            <h4>COMMANDS PREFIX</h4>
            <p>This is the prefix used to activate the bot for both built-in and custom commands. The default prefix is <b style={{fontSize: '20px'}}>&</b> (ampersand).</p>
            <Input value={prefix} onChange={(prefix) => handlePrefixUpdate(prefix)}/>
            <div style={{height: '100px'}}/>
            <SaveChangesBar open={hasChanges} onCancel={() => onChangesCancel()} onSave={() => {
                const req: SettingsReq = {
                    BotMasters: botMasterRoles.map(x => x.id),
                    Prefix: prefix
                }
                onSave(req)
            }}/>
        </div>
    )
}