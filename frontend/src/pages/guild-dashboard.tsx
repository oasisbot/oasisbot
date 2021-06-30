import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import {
	Redirect,
	Route,
	Switch,
	withRouter,
} from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

import GuildBar from '../components/navigation/guild-bar'
import PageHeader from './guild-dashboard/page-header'
import Home from './guild-dashboard/home'
import Commands from './guild-dashboard/commands/commands'
import Polls from './guild-dashboard/polls/polls'

import { Guild, SettingsReq } from '../protocol'
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
			alignItems: 'center',
		},
	})
)

export function GuildDashboard() {
	const queryClient = useQueryClient()
	const { isLoading, isError, data, error } = useQuery(
		'guild-dashboard',
		async () => {
			const id = common.GetDashboardID()
			const result = await fetch(`/api/guild_data?id=${id}`)
			if (!result.ok) {
				switch (result.status) {
					case 423:
						throw new Error('Unable to retrieve server data')
					case 401:
						throw new Error("We can't show you that!")
				}
			}
			return result.json()
		},
		{ retryDelay: 700 }
	)
	const { data: guilds } = useQuery(
		'guild-dashboard-guilds',
		async () => {
			const result = await fetch('/api/users/@me/guilds')
			if (!result.ok) throw new Error('Unable to retrieve guilds')
			return result.json().then((val) => val.filter((g: any) => g.HasBot))
		},
		{ retry: false }
	)

	const settingsMutation = useMutation((settings: SettingsReq) =>
		axios.patch(`/api/dashboard/settings?id=${data.ID}`, settings),
		{onSuccess: data => {
			queryClient.setQueryData('guild-dashboard', data.data)
		}}
	)

	const classes = useStyles()

	if (isLoading || !data || isError) {
		return <Loading error={isError ? (error as Error).toString() : ''} />
	}

	return (
		<div className={classes.guildDashboard}>
			<>
				<GuildContext.Provider value={data}>
					<GuildBar done={!isLoading} guild={data} guilds={guilds} />
					<Switch>
						<Route exact path="/d/:id">
							<Home guild={data} />
						</Route>
						<Route exact path="/d/:id/settings">
							<Settings guild={data} onSave={settingsMutation.mutate} />
						</Route>
						<Route exact path="/d/:id/commands">
							<PageHeader index={0} />
							<Commands />
						</Route>
						<Route exact path="/d/:id/polls">
							<PageHeader index={1} />
							<Polls />
						</Route>
						<Route exact path="/d/:id/giveaways">
							<PageHeader index={2} />
							{/* <Commands /> */}
						</Route>
						<Route exact path="/d/:id/embeds">
							<PageHeader index={3} />
							{/* <Commands /> */}
						</Route>
						<Route exact path="/d/:id/actions">
							<PageHeader index={4} />
							{/* <Commands /> */}
						</Route>
						<Route exact path="/d/:id/help">
							<PageHeader index={5} />
							{/* <Commands /> */}
						</Route>
						<Route path="/d/:id">
							<Redirect to={`/d/${data.ID}`} />
						</Route>
					</Switch>
				</GuildContext.Provider>
			</>
		</div>
	)
}

export default withRouter(GuildDashboard)
