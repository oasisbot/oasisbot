import { makeStyles, createStyles, Theme, Avatar } from '@material-ui/core'

import Dots from '../components/misc/dots'
import Logo from '../assets/icons/logo192.png'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: '100vh',
			width: '100vw',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		errGroup: {
			position: 'absolute',
			top: 'calc(50% + 60px)',
			transform: '-50%',
			color: '#dddddd',
			display: 'flex',
			alignItems: 'center',
			flexFlow: 'column',
			'& h1, & h3': {
				margin: 0,
			},
			'& h3': {
				color: '#cdcdcd',
				fontWeight: 'normal',
			},
		},
		avatar: {
			width: '60px',
			height: '60px',
			boxShadow: '0px 6px 10px 1px rgb(0, 0, 0, 20%)',
			cursor: 'pointer',
			'& img': {
				transition: 'transform 0.3s',
				'&:hover': {
					transform: 'rotateZ(120deg)',
				},
			},
		},
	})
)

export interface LoadingProps {
	error?: string | undefined
}

export default function Loading({ error = undefined }: LoadingProps) {
	const history = useHistory()
	const classes = useStyles()
	return (
		<div className={classes.root}>
			{error ? (
				<>
					<Avatar
						className={classes.avatar}
						src={Logo}
						variant="circle"
						onClick={() => history.push('/')}
					>
						<img src={Logo} />
					</Avatar>
					<div className={classes.errGroup}>
						<h1>WHOOPS!</h1>
						<h3>{error}</h3>
					</div>
				</>
			) : (
				<Dots />
			)}
		</div>
	)
}
