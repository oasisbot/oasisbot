import React from 'react'

import { makeStyles, createStyles, Theme, Divider } from '@material-ui/core'

import CustomCommandsIcon from '../../assets/custom_commands_icon.svg'
import PollIcon from '../../assets/poll_icon.svg'
import GiveawayIcon from '../../assets/giveaway_icon.svg'
import EmbedIcon from '../../assets/embed_icon.svg'
import ActionsIcon from '../../assets/actions_icon.svg'
import HelpIcon from '../../assets/help_icon.svg'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        headerGroup: {
            width: '100%',
            height: '100px',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            backgroundColor: '#161718f0'
        },
        header: {
            width: '100%',
            height: '100%',
            display: 'flex',
            maxWidth: '1200px',
            padding: '0px 20px',
        },
        content: {
            height: '100%',
            display: 'flex',
            alignItems: 'center'
        } 
    })
)

export interface PageHeaderProps {
    index: number
}

export default function PageHeader ({ index }: PageHeaderProps) {
    const classes = useStyles()
    const [icon, setIcon] = React.useState('')
    const [title, setTitle] = React.useState('')

    React.useEffect(() => {
        switch(index) {
            case 0: { setIcon(CustomCommandsIcon); setTitle('Custom Commands'); break }
            case 1: { setIcon(PollIcon); setTitle('Polls'); break }
            case 2: { setIcon(GiveawayIcon); setTitle('Giveaways'); break }
            case 3: { setIcon(EmbedIcon); setTitle('Embeds'); break }
            case 4: { setIcon(ActionsIcon); setTitle('Actions'); break }
            case 5: { setIcon(HelpIcon); setTitle('Help'); break }
        }
    }, [index])

    return (
        <div className={classes.headerGroup}>
            <Divider style={{width: '100%'}} />
            <header className={classes.header}>
                <div className={classes.content}>
                    <img src={icon} width='40px' height='40px'/>
                    <h2 style={{marginLeft: '25px', color: '#dddddd'}}>{title.toUpperCase()}</h2>
                </div>
            </header>
        </div>
    )
}