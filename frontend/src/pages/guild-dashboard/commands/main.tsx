import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

import * as common from '../../../common'
import { Command } from '../../../protocol'
import UICommand from './command'
import { GuildContext } from '../../guild-dashboard'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        content: {
            display: 'flex',
            width: '100%',
            flexFlow: 'column',
            marginTop: '15px',
        },
        actionCardContainer: {
            display: 'grid', 
            gap: '25px', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            [theme.breakpoints.down(370)]: {
                display: 'block',
                '& $actionCard': {
                    minWidth: '270px',
                    width: '100%',
                    marginBottom: '15px',
                    padding: '20px 25px'
                }
            }
        },
        actionCard: {
            minWidth: '330px',
            minHeight: '120px',
            borderRadius: '5px',
            padding: '20px 25px',
            display: 'flex',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 3px 15px 2px rgb(0, 0, 0, 20%)',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            flexFlow: 'column',
            '&:hover': {
                backgroundColor: '#46474eff'
            },
            '& h2': {
                margin: 0
            },
            '& p': {
                margin: '5px 0 0 0',
                color: '#bbbbbb'
            }
        },
        commandGhost: {
            width: '100%',
            height: '100px',
            [theme.breakpoints.down('xs')]: {
                height: '70px'
            },
            display: 'flex',
            borderRadius: '5px',
            marginBottom: '15px',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #46474eff',
            '& h2': {
                color: '#aaaaaa',
            }
        }
    })
)

export interface MainProps {
    commands: Command[]
    prefix: string
    onCommandToggle: (command: Command, enabled: boolean) => void
    onCommandDelete: (command: Command) => void
    onCommandSelect: (command: Command | undefined, option?: number) => void
}

export default function Main ({ commands, prefix, onCommandToggle, onCommandDelete, onCommandSelect }: MainProps) {
    const classes = useStyles()

    const guild = React.useContext(GuildContext)
    if (!guild) return null

    return (
        <>
        <div className={classes.content}>
            <h2 style={{color: '#dddddd'}}>NEW COMAND</h2>
            <div className={classes.actionCardContainer}>
                <div className={classes.actionCard} onClick={() => onCommandSelect(undefined, 0)}>
                    <h2>Basic</h2>
                    <p>A basic command that responds with text to the user that issued the command</p>
                </div>
                <div className={classes.actionCard} onClick={() => onCommandSelect(undefined, 1)}>
                    <h2>Randomized</h2>
                    <p>A command with multiple responses randomly chosen each time</p>
                </div>
                <div className={classes.actionCard}>
                    <h2>Embed</h2>
                    <p>Sends a really cool formatted embed message along with some optional text</p>
                </div>
                <div className={classes.actionCard} onClick={() => onCommandSelect(undefined, 3)}>
                    <h2>Role</h2>
                    <p>Assigns a specific role to the user that issued the command</p>
                </div>
                <div className={classes.actionCard} onClick={() => onCommandSelect(undefined, 4)}>
                    <h2>Advanced</h2>
                    <p>Commands with parameters that can add or remove roles and do even more!</p>
                </div>
            </div>
            <div style={{marginTop: '20px', display: 'flex', alignItems: 'center'}}>
                <h2 style={{color: '#dddddd', display: 'inline-block'}}>COMMANDS</h2>
                <h2 style={{color: '#888888', fontSize: '15px', marginLeft: '7px', display: 'inline-block'}}>- 10 SLOTS LEFT</h2>
            </div>
            {
                commands.length > 0 ? (
                    commands.map(c => {
                        return <UICommand 
                        key={c.Name} 
                        name={c.Name}
                        description={c.Description} 
                        enabled={c.Enabled} 
                        prefix={prefix}
                        onEnableChange={(enabled: boolean) => onCommandToggle(c, enabled)}
                        onSelect={() => onCommandSelect(c)}
                        onDelete={() => onCommandDelete(c)}
                        />
                    })
                ) : 
                <div className={classes.commandGhost}>
                    <h2>No custom commands... yet</h2>
                </div>
            }
        </div>
        <div style={{height: '100px'}}></div>
        </>
    )
}