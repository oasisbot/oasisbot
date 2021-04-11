import React from 'react'
import { Home } from './pages/home'
import { Route, Switch, withRouter } from 'react-router-dom'

import NavigationBar from './components/navigation-bar'

import Login from './pages/login'
import Dashboard from './pages/dashboard'
import GuildDashboard from './pages/guild-dashboard'

import { User } from './protocol'

interface UserData {
  done: boolean;
  user: User | undefined;
}

export const UserContext = React.createContext<UserData>({ done: false, user: undefined })

function App() {
  const [done, setDone] = React.useState(false)
  const [user, setUser] = React.useState<User | undefined>()

  React.useEffect(() => {
    const loadData = async () => {
        const result = await fetch('/api/users/@me')
        if (result.status === 401) { setDone(true); return } // Not authenticated

        const data = await result.body?.getReader().read()
        if (!data) {
          setUser(undefined)
          setDone(true)
          return
        }
        const user = JSON.parse(new TextDecoder().decode(data.value)) as User
        
        setUser(user)
        setDone(true)
    }
    loadData()
  }, [])

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      flexFlow: 'column'
    }}>
      <Switch>
        <UserContext.Provider value={{done: done, user: user}}>
          <Route exact path='/'>
            <NavigationBar />
            <Home />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/dashboard'>
            <NavigationBar />
            <Dashboard />
          </Route>
          <Route path='/d/:id'>
            <GuildDashboard />
          </Route>
        </UserContext.Provider>
      </Switch>
    </div>
  )
}

export default withRouter(App)
