import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import * as common from '../../../common'
import { Command } from '../../../protocol'
import Dots from '../../../components/dots'
import Main from './main'
import { GuildContext } from '../../guild-dashboard'
import CommandView from './command-view'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flex: '1',
            flexFlow: 'column',
            alignItems: 'center',
            padding: '0px 20px',
            overflowX: 'hidden'
        }
    })
)
export default function Commands () {
    const classes = useStyles()
    const guild = React.useContext(GuildContext)
    const [commands, setCommands] = React.useState<Command[] | undefined>()
    const [currentEdit, setCurrentEdit] = React.useState<boolean | undefined>()
    const [currentCommand, setCurrentCommand] = React.useState<Command | undefined>()

    React.useEffect(() => {
        const fun = async () => {
            let result = await fetch(`/api/plugins/commands?id=${common.GetDashboardID()}`)

            let data = await result.body?.getReader().read()
            if (!data) return
            const commands = JSON.parse(new TextDecoder().decode(data.value)) as Command[]
            setCommands(commands)
        }
        fun()
    }, [])

    if (!guild) return null

    const onCommandToggle = async (c: Command, enabled: boolean) => {
        if (!commands) return
        var xhr = new XMLHttpRequest()
        xhr.open('PATCH', `/api/plugins/commands/${c.Name}?id=${guild.ID}`)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText) as Command
                const index = commands.findIndex(x => x.Name === json.Name)
                commands[index] = json 
            }
        }
        var json = JSON.stringify(c)
        xhr.send(json)
    }

    const onCommandSave = async (c: Command, originalName: string = c.Name) => {
        if (currentEdit === undefined) return
        if (!currentEdit) { // Creating a command
            var xhr = new XMLHttpRequest()
            xhr.open('POST', `/api/plugins/commands?id=${guild.ID}`)
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    setCurrentCommand(undefined)
                    var json = JSON.parse(xhr.responseText) as Command
                    const modified = Array.from(commands || [])
                    modified.unshift(json)
                    setCommands(modified)
                }
            }
            var json = JSON.stringify(c)
            xhr.send(json)
        } else { // Updating a command
            if (!commands) return
            var xhr = new XMLHttpRequest()
            xhr.open('PATCH', `/api/plugins/commands/${originalName}?id=${guild.ID}`)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    setCurrentCommand(undefined)
                    var json = JSON.parse(xhr.responseText) as Command
                    if (json.Name == originalName) {
                        const index = commands.findIndex(x => x.Name === json.Name)
                        const modified = Array.from(commands)
                        modified[index] = json
                        setCommands(modified)
                    } else {
                        const index = commands.findIndex(x => x.Name === originalName)
                        const modified = Array.from(commands)
                        modified.splice(index, 1, json)
                        setCommands(modified)
                    }
                }
            }
            var json = JSON.stringify(c)
            xhr.send(json)
        }
    }

    const onCommandDelete = async (c: Command) => {
        if (!commands) return
        var xhr = new XMLHttpRequest()
        xhr.open('DELETE', `/api/plugins/commands/${c.Name}?id=${guild.ID}`)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const modified = Array.from(commands)
                modified.splice(commands.findIndex(x => x.Name === c.Name), 1)
                setCommands(modified)
            }
        }
        xhr.send()
    }

    const onClose = () => {
        setCurrentEdit(undefined)
        setCurrentCommand(undefined)
    } 
    
    const onCommandSelect = (c: Command | undefined, option?: number) => {
        if (!c) {
            const command: Command = {
                GuildID: guild.ID,
                Name: 'new-command',
                Description: '',
                Enabled: true,
                Type: option || 0,
                Responses: [""],
                AssignedRoles: [],
                AllowedRoles: [],
                ForbiddenRoles: [],
                ForbiddenChannels: []
            }
            if (option == 4) {
                command.Responses[0] =
`{{/*
GO TEMPLATE EDITOR V2
Helpful links:
[custom command documentation] https://docs.oasisbot.xyz/dashboard-and-permissions#bot-masters
[Go's templating library] https://golang.org/pkg/text/template/
*/}}`
            }
            setCurrentEdit(false)
            setCurrentCommand(command)
        } else {
            setCurrentEdit(true)
            setCurrentCommand(c)
        }
    }

    return (
        <div className={classes.root}>
        {
            commands && !currentCommand ?
            <>
               <Main 
               commands={commands} 
               prefix={guild.Prefix}
               onCommandToggle={onCommandToggle} 
               onCommandDelete={onCommandDelete}
               onCommandSelect={onCommandSelect}
               /> 
            </> 
            : currentCommand ?
            <CommandView command={currentCommand} editing={currentEdit || false} onClose={onClose} onSave={onCommandSave}/>
            : 
            <div style={{height: '100%', display: 'flex', flex: '1', alignItems: 'center'}}>
                <Dots/>
            </div>
        }
        </div>
    )
}