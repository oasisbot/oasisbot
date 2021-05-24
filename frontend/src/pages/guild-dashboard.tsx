import React, { useContext } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import { Redirect, Route, Switch, useHistory, withRouter } from 'react-router-dom'

import GuildBar from '../components/guild-bar'
import PageHeader from './guild-dashboard/page-header'
import Home from './guild-dashboard/home'
import Commands from './guild-dashboard/commands/commands'
import Polls from './guild-dashboard/polls/polls'

import { Guild, GuildPreview, SettingsReq } from '../protocol'
import { UserContext } from '../app'
import Loading from './loading'
import * as common from '../common'
import Settings from './guild-dashboard/settings'

export const GuildContext = React.createContext<Guild | undefined>(undefined)

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        guildDashboard: {
            width: '100%',
            display: 'flex',
            minHeight: '100vh',
            flexFlow: 'column',
            alignItems: 'center'
        },
    })
)

export function GuildDashboard () {
    const history = useHistory()
    const [done, setDone] = React.useState(false)
    const [loadingErr, setLoadingErr] = React.useState<string | undefined>()
    const [guild, setGuild] = React.useState<Guild | undefined>()
    const [guilds, setGuilds] = React.useState<GuildPreview[] | undefined>()
    const userData = useContext(UserContext)
    const classes = useStyles()

    React.useEffect(() => {
        const doFetch = async () => {
            if (!userData.done) return
            if (userData.user == undefined) {
                history.push('/login')
                return
            }

            let result = await fetch(`/api/guild_data?id=${common.GetDashboardID()}`)
            let data = await result.body?.getReader().read()
            if (!data || result.status !== 200) {
                setTimeout(() => {
                    switch (result.status) {
                        case 423: { setLoadingErr("Unable to retrieve server data"); break }
                        case 401: { setLoadingErr("We can't show you that!"); break }
                    }
                }, 450)
                return
            }
            const guild = JSON.parse(new TextDecoder().decode(data.value)) as Guild
            setGuild(guild)
            setDone(true)

            result = await fetch('/api/users/@me/guilds')
            if (result.status === 401) { 
                window.location.href = '/login'
            } 
            data = await result.body?.getReader().read()
            if (!data) return
            let unsorted = JSON.parse(new TextDecoder().decode(data.value)) as GuildPreview[]
            setGuilds(unsorted.filter(g => g.HasBot))
        }
        doFetch()
    }, [userData.done])

    const updateSettings = (settings: SettingsReq) => {
        if (!guild) return
        var xhr = new XMLHttpRequest()
        xhr.open('PATCH', `/api/dashboard/settings?id=${guild.ID}`)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText) as Guild
                setGuild(json)
            }
        }
        var json = JSON.stringify(settings)
        xhr.send(json)
    }

    return (
        <div className={classes.guildDashboard}>
        { userData.user && done && guild ?
        <>
        <GuildContext.Provider value={guild}>
            <GuildBar done={done} guild={guild} guilds={guilds}/>
            <Switch>
                <Route exact path='/d/:id'>
                    <Home guild={guild}/>
                </Route>
                <Route exact path='/d/:id/settings'>
                    <Settings guild={guild} onSave={updateSettings}/>
                </Route>
                <Route exact path='/d/:id/commands'>
                    <PageHeader index={0}/>
                    <Commands/>
                </Route>
                <Route exact path='/d/:id/polls'>
                    <PageHeader index={1}/>
                    <Polls/>
                </Route>
                <Route exact path='/d/:id/giveaways'>
                    <PageHeader index={2}/>
                    {/* <Commands /> */}
                </Route>
                <Route exact path='/d/:id/embeds'>
                    <PageHeader index={3}/>
                    {/* <Commands /> */}
                </Route>
                <Route exact path='/d/:id/actions'>
                    <PageHeader index={4}/>
                    {/* <Commands /> */}
                </Route>
                <Route exact path='/d/:id/help'>
                    <PageHeader index={5}/>
                    {/* <Commands /> */}
                </Route>
                <Route path='/d/:id'>
                    <Redirect to={`/d/${guild.ID}`}/>
                </Route>
            </Switch>
        </GuildContext.Provider>
        </> : <Loading error={loadingErr}/>
        }   
        </div>
    )
}

export default withRouter(GuildDashboard)