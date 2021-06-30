import React from 'react'
import { Home } from './pages/home'
import { Route, Switch, withRouter } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import Login from './pages/login'
import Dashboard from './pages/dashboard'
import GuildDashboard from './pages/guild-dashboard'
import NavigationBar from './components/navigation/navigation-bar'
import Dots from './components/misc/dots'

import { User } from './protocol'
import * as url from './util/url'

interface UserData {
	user: User | undefined
	loading: boolean
}

export const UserContext = React.createContext<UserData>({
	user: undefined,
	loading: true
})

function App() {
	const history = useHistory()
	const { data: user, isLoading } = useQuery(
		'fetch-user',
		async () => {
			const result = await fetch('/api/users/@me')
			if (!result.ok && url.isOnAccessPage()) {
				history.push('/login')
				return
			} else if (result.status == 401) return
			return result.json()
		},
		{ retry: false }
	)

	if (isLoading && url.isOnAccessPage()) {
		return (
			<div
				style={{
					display: 'flex',
					width: '100%',
					minHeight: '100vh',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Dots />
			</div>
		)
	}

	return (
		<div
			style={{
				display: 'flex',
				width: '100%',
				minHeight: '100vh',
				flexFlow: 'column',
			}}
		>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Switch>
					<UserContext.Provider value={{ user: user, loading: isLoading }}>
						<Route exact path="/">
							<NavigationBar />
							<Home />
						</Route>
						<Route exact path="/login">
							<Login />
						</Route>
						<Route exact path="/dashboard">
							<NavigationBar />
							<Dashboard />
						</Route>
						<Route path="/d/:id">
							<GuildDashboard />
						</Route>
					</UserContext.Provider>
				</Switch>
			</MuiPickersUtilsProvider>
		</div>
	)
}

export default withRouter(App)
