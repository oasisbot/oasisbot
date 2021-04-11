import React from 'react'
import { Button } from '@material-ui/core'

export default function Login () {
    React.useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('/api/users/@me')
            if (result.status === 200) { 
                window.location.href = '/'
            }
        } 
        fetchData()
    }, [])

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            alignItems: 'center',
            flexFlow: 'column',
            justifyContent: 'center'
        }}>
            <h1>Welcome to OasisBot.xyz!</h1>
            <p>Login to continue</p>
            <Button variant='contained' size='large' color='primary'>
                Login with Discord
            </Button>
        </div>
    )
}