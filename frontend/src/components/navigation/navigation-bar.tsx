import React from 'react'
import {
	makeStyles,
	createStyles,
	Theme,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Divider,
	ListSubheader,
} from '@material-ui/core'
import UserDropdown from './user-dropdown'

import { useHistory } from 'react-router'
import { UserContext } from '../../app'

import MenuIcon from '@material-ui/icons/Menu'

import Logo192 from '../../assets/icons/logo192.png'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flex: '0 1 auto',
			width: '100%',
			height: '100px',
			padding: '0px 32px',
		},
		headerSpan: {
			fontSize: '30px',
			fontWeight: 'bold',
			cursor: 'pointer',
			[theme.breakpoints.down('xs')]: {
				fontSize: '20px',
				marginRight: '10px',
			},
		},
		icon: {
			marginRight: '10px',
			[theme.breakpoints.down('sm')]: {
				display: 'none',
			},
		},
		hamburger: {
			display: 'none',
			width: '74px',
			alignItems: 'center',
			flexFlow: 'row',
			[theme.breakpoints.down('sm')]: {
				display: 'flex',
			},
		},
		mainNav: {
			display: 'flex',
			flex: '1 1 0%',
			marginLeft: '25px',
			[theme.breakpoints.down('sm')]: {
				display: 'none',
			},
		},
		listContainer: {
			listStyleType: 'none',
			padding: '0',
			display: 'flex',
		},
		listItem: {
			margin: '0 7px',
			fontSize: '17px',
			'& a': {
				color: '#dddddd',
				textDecoration: 'none',
				transition: 'color 0.2s',
				'&:hover': {
					color: 'white',
				},
			},
		},
		userContainer: {
			position: 'absolute',
			display: 'flex',
			flexFlow: 'row-reverse',
			alignItems: 'center',
			right: '0',
			height: '70px',
			borderRadius: '15px',
		},
		dropdown: {
			position: 'absolute',
			top: 28,
			width: '170px',
			right: '20px',
			zIndex: 1,
			borderRadius: '5px',
			backgroundColor: theme.palette.background.paper,
		},
		drawer: {
			backgroundColor: theme.palette.background.default,
			width: '70vw',
			maxWidth: '400px',
			height: '100%',
		},
	})
)

export default function NavigationBar() {
	const history = useHistory()
	const classes = useStyles()
	const { done, user } = React.useContext(UserContext)
	const [drawerOpen, setDrawerOpen] = React.useState(false)

	return (
		<div className={classes.root}>
			<React.Fragment />
			<header
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '100vw',
					justifyContent: 'space-between',
				}}
			>
				<img
					className={classes.icon}
					src={Logo192}
					height="35px"
					width="35px"
				/>
				<div
					className={classes.hamburger}
					onClick={() => setDrawerOpen(true)}
				>
					<MenuIcon />
				</div>
				<span
					className={classes.headerSpan}
					onClick={() => history.push('/')}
				>
					OasisBot
				</span>
				<nav className={classes.mainNav}>
					<ul className={classes.listContainer}>
						<li className={classes.listItem}>
							<a href="/features">Features</a>
						</li>
						<li className={classes.listItem}>
							<a href="https://docs.oasisbot.xyz">
								Documentation
							</a>
						</li>
						<li className={classes.listItem}>
							<a href="/faq">FAQ</a>
						</li>
					</ul>
				</nav>
				{!done ? (
					<></>
				) : user ? (
					<UserDropdown user={user} />
				) : (
					<Button
						onClick={login}
						color="primary"
						type="button"
						size="medium"
						variant="contained"
					>
						Login
					</Button>
				)}
			</header>
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
			>
				<div role="presentation" className={classes.drawer}>
					<div onClick={() => setDrawerOpen(false)}>
						<List>
							<ListItem
								button
								key="features"
								onClick={() => history.push('/features')}
							>
								<ListItemText primary="Features" />
							</ListItem>
							<ListItem
								button
								key="docs"
								onClick={() => history.push('/docs')}
							>
								<ListItemText primary="Documentation" />
							</ListItem>
							<ListItem
								button
								key="faq"
								onClick={() => history.push('/faq')}
							>
								<ListItemText primary="FAQ" />
							</ListItem>
						</List>
					</div>
				</div>
			</Drawer>
			<React.Fragment />
		</div>
	)
}

const login = () => {
	window.open(
		'https://discord.com/api/oauth2/authorize?client_id=749649771639341207&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds'
	)
}
