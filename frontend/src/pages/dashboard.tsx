import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles, createStyles, Theme, Paper, Avatar, Button, Card, CardContent, Typography } from '@material-ui/core'

import { GuildPreview } from '../protocol'
import { useHistory } from 'react-router-dom'
import GuildIcon from '../components/guild-icon'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        guildContainer: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        cardSkeleton: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'column',
            width: '200px',
            height: '260px',
            margin: '10px',
            borderRadius: '5px',
            boxShadow: '0px 6px 10px 1px rgb(0, 0, 0, 20%)',
            backgroundColor: theme.palette.background.paper,
        },
        card: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'column',
            textAlign: 'center',
            width: '200px',
            height: '260px',
            margin: '10px',
            borderRadius: '5px',
            boxShadow: '0px 6px 10px 1px rgb(0, 0, 0, 20%)',
            backgroundColor: theme.palette.background.paper,
            transition: 'background-color 0.3s, box-shadow 0.3s, transform 0.3s',
            transform: 'perspective(1000px) rotateX(0deg)',
            transformOrigin: 'top',
            '&:hover': {
                backgroundColor: '#46474eff',
                transform: 'perspective(1000px) rotateX(3deg)',
                boxShadow: '0px 20px 20px 1px rgb(0, 0, 0, 20%)',
                '& $cardAvatar': {
                    transform: 'perspective(1000px) translateY(-5px) translateZ(30px) rotateX(-3deg)',
                    boxShadow: '0px 10px 18px 4px rgb(0, 0, 0, 35%)',
                }
            }
        },
        cardAvatar: {
            boxShadow: '0px 10px 15px 1px rgb(0, 0, 0, 40%)',
            margin: '0 auto',
            marginTop: '20px',
            width: '50px',
            height: '50px',
            transform: 'perspective(1000px)',
            transition: 'transform 0.3s, box-shadow 0.3s'
        }
    })
)

export default function Dashboard () {
    let history = useHistory();
    const classes = useStyles()
    const [guilds, setGuilds] = React.useState<undefined | GuildPreview[]>()

    React.useEffect(() => {
        const doFetch = async () => {
            const result = await fetch('/api/users/@me/guilds')
            if (result.status === 401) { 
                window.location.href = '/login'
            } 

            const data = await result.body?.getReader().read()
            if (!data) return
            let unsorted = JSON.parse(new TextDecoder().decode(data.value)) as GuildPreview[]
            setGuilds(unsorted.sort(function(x, y) { return (y.HasBot ? 1 : 0) - (x.HasBot ? 1 : 0) }))
        }
        doFetch()
    }, [])

    return (
        <div style={{display: 'flex', position: 'relative', flexFlow: 'column', width: '100%', top: '0', height: '100%'}}>
        <div style={{position: 'relative', width: '100%', textAlign: 'center', height: '100px'}}>
            <h1 style={{color: '#dddddd'}}>SELECT A SERVER</h1>
        </div>
        <div className={classes.guildContainer}>
            {   
                !guilds ?
                <>
                    <div className={classes.cardSkeleton}>
                        <Skeleton variant='circle' className={classes.cardAvatar}/>
                        <Skeleton variant='text' width='150px' height='30px' style={{marginTop: '10px'}}/>
                        <Skeleton width='150px' height='70px' style={{position: 'absolute', bottom: '15px'}}/>
                    </div>
                    <div className={classes.cardSkeleton}>
                        <Skeleton variant='circle' className={classes.cardAvatar}/>
                        <Skeleton variant='text' width='150px' height='30px' style={{marginTop: '10px'}}/>
                        <Skeleton width='150px' height='70px' style={{position: 'absolute', bottom: '15px'}}/>
                    </div>
                    <div className={classes.cardSkeleton}>
                        <Skeleton variant='circle' className={classes.cardAvatar}/>
                        <Skeleton variant='text' width='150px' height='30px' style={{marginTop: '10px'}}/>
                        <Skeleton width='150px' height='70px' style={{position: 'absolute', bottom: '15px'}}/>
                    </div>
                    <div className={classes.cardSkeleton}>
                        <Skeleton variant='circle' className={classes.cardAvatar}/>
                        <Skeleton variant='text' width='150px' height='30px' style={{marginTop: '10px'}}/>
                        <Skeleton width='150px' height='70px' style={{position: 'absolute', bottom: '15px'}}/>
                    </div>
                    <div className={classes.cardSkeleton}>
                        <Skeleton variant='circle' className={classes.cardAvatar}/>
                        <Skeleton variant='text' width='150px' height='30px' style={{marginTop: '10px'}}/>
                        <Skeleton width='150px' height='70px' style={{position: 'absolute', bottom: '15px'}}/>
                    </div>
                    <div className={classes.cardSkeleton}>
                        <Skeleton variant='circle' className={classes.cardAvatar}/>
                        <Skeleton variant='text' width='150px' height='30px' style={{marginTop: '10px'}}/>
                        <Skeleton width='150px' height='70px' style={{position: 'absolute', bottom: '15px'}}/>
                    </div>
                </>
                :
                (
                    guilds.map(guild => {
                        return (
                            <div className={classes.card}>
                                <GuildIcon className={classes.cardAvatar} guild={guild} style={{margin: '0 auto', marginTop: '20px', width: '50px', height: '50px'}}/>
                                <h3 style={{fontWeight: 'normal'}}>{guild.Name}</h3>
                                {
                                    guild.HasBot ?
                                    <Button 
                                    variant='contained'
                                    color='primary'
                                    onClick={() => history.push(`../d/${guild.ID}`)}
                                    style={{position: 'absolute', bottom: '20px'}}>
                                        Go to dashboard
                                    </Button>
                                    :
                                    <Button
                                    variant='contained'
                                    color='inherit'
                                    onClick={() => window.open(`https://discord.com/oauth2/authorize?client_id=749649771639341207&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fguild-oauth&response_type=code&guild_id=${guild.ID}&scope=bot&permissions=8`)}
                                    style={{position: 'absolute', bottom: '20px', backgroundColor: '#525252'}}>
                                        Set up Oasis Bot
                                    </Button>
                                }
                            </div>
                        )
                    })
                )
            }
            <div style={{height: '50px'}} />
        </div>
        { guilds ?  
            <div style={{width: '100%', textAlign: 'center', marginTop: '30px'}}>
                <p style={{display: 'inline-block', color: '#999999'}}>Don't see your server listed?</p>
                <a style={{display: 'inline-block', color: '#999999', marginLeft: '5px'}} href='https://docs.oasisbot.xyz/getting-started#troubleshooting' target='_blank'>Find out why</a>
            </div>
            : null
        }
        </div>
    )
}