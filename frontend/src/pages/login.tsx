import React from 'react'
import { Button, Divider } from '@material-ui/core'

import { login } from 'src/lib/login'

export default function Login() {
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
		<div
			style={{
				display: 'flex',
				width: '100%',
				height: '100vh',
				alignItems: 'center',
				flexFlow: 'column',
				justifyContent: 'center',
			}}
		>
			<h1>Welcome to OasisBot.xyz!</h1>
			<p>Login to continue</p>
			<Button variant="contained" size="large" color="primary" onClick={() => login()}>
				Login with Discord
			</Button>
			<Divider
				orientation="horizontal"
				style={{ width: '300px', margin: '30px' }}
			/>
			<p style={{ marginTop: 0 }}>...or perhaps maybe</p>
			<Button
				variant="outlined"
				size="medium"
				color="secondary"
				onClick={() => (window.location.pathname = '/')}
			>
				I'll just look around for now
			</Button>
		</div>
	)
}
