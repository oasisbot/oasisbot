import { makeStyles, createStyles, Theme, Divider } from '@material-ui/core'

import CustomCommandsIcon from '../../assets/custom_commands_icon.svg'
import PollIcon from '../../assets/poll_icon.svg'
import GiveawayIcon from '../../assets/giveaway_icon.svg'
import EmbedIcon from '../../assets/embed_icon.svg'
import ActionsIcon from '../../assets/actions_icon.svg'
import HelpIcon from '../../assets/help_icon.svg'

import { useHistory } from 'react-router'

import { Guild } from '../../protocol'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        homeContainer: {
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
            maxWidth: '1200px',
            marginTop: '15px',
            padding: '0px 20px',
            [theme.breakpoints.down(370)]: {
                padding: '0px'
            }
        },
        cardContainer: {
            display: 'grid',
            gap: '25px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            [theme.breakpoints.down(370)]: {
                display: 'block',
                '& $homeCard, & $tutorialCard': {
                    minWidth: '270px',
                    width: '100%',
                    marginBottom: '15px',
                    '& img': {
                        width: '40px'
                    }
                }
            }
        },
        homeCard: {
            minWidth: '330px',
            minHeight: '120px',
            borderRadius: '5px',
            padding: '25px 30px',
            display: 'flex',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 3px 15px 2px rgb(0, 0, 0, 20%)',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#46474eff'
            },
            '& p': {
                margin: '0',
                color: '#cccccc'
            },
            '& h2': {
                margin: '0',
                marginBottom: '5px'
            }
        },
        tutorialCard: {
            minWidth: '330px',
            minHeight: '50px',
            borderRadius: '5px',
            padding: '15px 20px',
            display: 'flex',
            border: `3px solid ${theme.palette.background.paper}`,
            boxShadow: '0 3px 15px 2px rgb(0, 0, 0, 20%)',
            transition: 'border 0.2s',
            cursor: 'pointer',
            '&:hover': {
                border: `3px solid #46474eff`,
            },
            '& p': {
                margin: '0',
                color: '#cccccc'
            },
            '& h2': {
                margin: '0',
                marginBottom: '5px'
            }
        }
    })
)

export interface HomeProps {
    guild: Guild
}

export default function Home ({ guild }: HomeProps) {
    const history = useHistory()
    const classes = useStyles()
    
    const handleCardClick = (index: number) => {
        const basePath = `/d/${guild?.ID}`
        switch (index) {
            case 0: { history.push(`${basePath}/commands`); break }
            case 1: { history.push(`${basePath}/polls`); break }
            case 2: { history.push(`${basePath}/giveaways`); break }
            case 3: { history.push(`${basePath}/embeds`); break }
            case 4: { history.push(`${basePath}/actions`); break }
            case 5: { history.push(`${basePath}/help`); break }
        }
    }

    const handleRedirect = (index: number) => {
        switch (index) {
            case 0: { window.open("https://docs.oasisbot.xyz") }
        }
    }

    return (
        <section className={classes.homeContainer}>
            <h2 style={{ marginLeft: '10px', color: '#dddddd' }}>General</h2>
            <div className={classes.cardContainer}>
                <div className={classes.homeCard} onClick={() => handleCardClick(0)}>
                    <div style={{height: '100%', width: '60px'}}>
                        <img src={CustomCommandsIcon} width='60px'/>
                    </div>
                    <div style={{marginLeft: '15px'}}>
                        <h2>Custom Commands</h2>
                        <p>Create powerul commands that will level-up your server!</p>
                    </div>
                </div>
                <div className={classes.homeCard} onClick={() => handleCardClick(1)}>
                    <div style={{height: '60px', width: '60px'}}>
                        <img src={PollIcon} width='60px' height='60px'/>
                    </div>
                    <div style={{marginLeft: '15px'}}>
                        <h2>Polls</h2>
                        <p>Create polls and surveys that members can vote for</p>
                    </div>
                </div>
                <div className={classes.homeCard} onClick={() => handleCardClick(2)}>
                    <div style={{height: '100%', width: '60px'}}>
                        <img src={GiveawayIcon} width='60px'/>
                    </div>
                    <div style={{marginLeft: '15px'}}>
                        <h2>Giveaways</h2>
                        <p>Start giveaways that members can enter to win cool prizes!</p>
                    </div>
                </div>
                <div className={classes.homeCard} onClick={() => handleCardClick(3)}>
                    <div style={{height: '100%', width: '60px'}}>
                        <img src={EmbedIcon} width='60px'/>
                    </div>
                    <div style={{marginLeft: '15px'}}>
                        <h2>Embeds</h2>
                        <p>Send cool formatted announcement messages</p>
                    </div>
                </div>
                <div className={classes.homeCard} onClick={() => handleCardClick(4)}>
                    <div style={{height: '100%', width: '60px'}}>
                        <img src={ActionsIcon} width='60px'/>
                    </div>
                    <div style={{marginLeft: '15px'}}>
                        <h2>Actions</h2>
                        <p>Listen for messages sent and add your own events</p>
                    </div>
                </div>
                <div className={classes.homeCard} onClick={() => handleCardClick(5)}>
                    <div style={{height: '100%', width: '60px'}}>
                        <img src={HelpIcon} width='60px'/>
                    </div>
                    <div style={{marginLeft: '15px'}}>
                        <h2>Help</h2>
                        <p>Override the default help command and add info about your server</p>
                    </div>
                </div>
            </div>
            <h2 style={{ marginLeft: '10px', marginTop: '60px', color: '#dddddd' }}>Getting Started</h2>
            <div className={classes.tutorialCard} style={{width: '100%'}} onClick={() => handleRedirect(0)}>
                <div>
                    <h2>Documentation Center</h2>
                    <p>Everything you need to know about OasisBot and how to use it!</p>
                </div>
            </div>
            <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Divider style={{flex: '1', marginRight: '20px'}}/>
                <h3 style={{color: '#bbbbbb'}}>Topics</h3>
                <Divider style={{flex: '1', marginLeft: '20px'}}/>
            </div>
            <div className={classes.cardContainer}>
                <div className={classes.tutorialCard} onClick={() => handleCardClick(1)}>
                    <div>
                        <h2>Dashboard & Permissions</h2>
                        <p>Learn how to manage your dashboard and assign others</p>
                    </div>
                </div>
                <div className={classes.tutorialCard} onClick={() => handleCardClick(1)}>
                    <div>
                        <h2>Custom Commands</h2>
                        <p>Learn how to create custom commands and how to use them</p>
                    </div>
                </div>
                <div className={classes.tutorialCard} onClick={() => handleCardClick(1)}>
                    <div>
                        <h2>Actions</h2>
                        <p>Learn how to manage actions</p>
                    </div>
                </div>
            </div>
            <div style={{height: '50px'}}/>
        </section> 
    )
}