import React from 'react'
import { UserContext } from '../../app'
import {
	makeStyles,
	createStyles,
	Theme,
	ClickAwayListener,
	Tabs,
	Tab,
} from '@material-ui/core'
import UserDropdown from './user-dropdown'
import { useHistory } from 'react-router-dom'
import { Guild, GuildPreview } from '../../protocol'

import GuildIcon from '../guilds/guild-icon'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Skeleton from '@material-ui/lab/Skeleton'

import Logo192 from '../../assets/icons/logo192.png'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			height: 'auto',
			display: 'flex',
			flexFlow: 'column',
			justifyContent: 'center',
			backgroundColor: '#161619ff',
		},
		bar: {
			width: '100%',
			height: '100px',
			display: 'flex',
			padding: '0px 32px',
			alignItems: 'center',
			justifyContent: 'space-between',
			[theme.breakpoints.down('xs')]: {
				height: '70px',
			},
		},
		navCenter: {
			display: 'flex',
			flex: '1 1 0px',
			alignItems: 'center',
			justifyContent: 'space-between',
			marginInlineEnd: '15px',
			flexFlow: 'row-reverse',
		},
		guildArea: {
			position: 'relative',
			height: '50px',
			width: '250px',
			display: 'flex',
			alignItems: 'center',
			borderRadius: '5px',
			backgroundColor: theme.palette.background.default,
			cursor: 'pointer',
			[theme.breakpoints.down('xs')]: {
				display: 'none',
			},
		},
		guildDropdown: {
			zIndex: 2,
			position: 'absolute',
			top: '55px',
			width: '100%',
			height: 'auto',
			borderRadius: '5px',
			overflow: 'hidden',
			backgroundColor: theme.palette.background.paper,
			boxShadow: '0 3px 15px 4px rgb(0, 0, 0, 20%)',
		},
		dropdownElement: {
			width: '100%',
			height: '50px',
			display: 'flex',
			alignItems: 'center',
			transition: 'background-color 0.2s',
			'&:hover': {
				backgroundColor: '#46474eff',
			},
		},
		nl: {
			margin: '0px 15px',
			fontSize: '15px',
			fontWeight: 'bold',
			lineHeight: '30px',
			cursor: 'pointer',
			borderBottom: '3px solid rgb(0, 0, 0, 0)',
		},
		nls: {
			margin: '0px 15px',
			fontSize: '15px',
			fontWeight: 'bold',
			lineHeight: '30px',
			cursor: 'pointer',
			borderBottom: '3px solid #e53935',
		},
		mainTabs: {
			marginLeft: '10px',
			[theme.breakpoints.down(1050)]: {
				display: 'none',
			},
		},
		tabBar: {
			zIndex: 1,
			width: '100%',
			height: '50px',
			backgroundColor: '#161619ff',
			display: 'none',
			justifyContent: 'center',
			[theme.breakpoints.down(1050)]: {
				display: 'flex',
			},
		},
	})
)

export interface GuildBarProps {
	done: boolean
	guild: Guild | undefined
	guilds: GuildPreview[] | undefined
}

export default function GuildBar(props: GuildBarProps) {
	const history = useHistory()
	const { done, user } = React.useContext(UserContext)
	const classes = useStyles()

	const [guildDropdownOpen, setGuildDropdownOpen] = React.useState(false)
	const [pageIndex, setPageIndex] = React.useState(0)

	const handlePageChange = (_: React.ChangeEvent<{}>, value: number) => {
		if (!props.guild || !props.guild.ID) {
			window.location.reload()
			return
		}
		setPageIndex(value)
		switch (value) {
			case 0:
				history.push(`/d/${props.guild.ID}`)
				break
			case 1:
				history.push(`/d/${props.guild.ID}/settings`)
				break
			case 2:
				history.push(`/d/${props.guild.ID}/help`)
				break
		}
	}

	React.useEffect(() => {
		if (!props.guild || !props.guild.ID) {
			window.location.reload()
			return
		}
		switch (window.location.pathname) {
			case `/d/${props.guild.ID}`:
				setPageIndex(0)
				break
			case `/d/${props.guild.ID}/settings`:
				setPageIndex(1)
				break
			case `/d/${props.guild.ID}/help`:
				setPageIndex(2)
				break
		}
	}, [])

	React.useEffect(() => {
		if (done && !user) history.push('/login')
	}, [done])

	return (
		<div className={classes.root}>
			<div className={classes.bar}>
				<img
					src={Logo192}
					height="40px"
					width="40px"
					style={{ marginRight: '10px', cursor: 'pointer' }}
					onClick={() => history.push('/')}
				/>
				<Tabs
					className={classes.mainTabs}
					value={pageIndex}
					indicatorColor="primary"
					textColor="primary"
					onChange={handlePageChange}
				>
					<Tab label="Plugins" />
					<Tab label="Settings" />
					<Tab label="Support" />
				</Tabs>
				<div className={classes.navCenter}>
					{props.done && props.guild ? (
						<div
							className={classes.guildArea}
							onClick={() =>
								setGuildDropdownOpen(!guildDropdownOpen)
							}
						>
							<GuildIcon
								style={{
									height: '30px',
									width: '30px',
									marginLeft: '10px',
								}}
								guild={props.guild}
							/>
							<div
								style={{
									margin: '0 10px',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									maxWidth: '160px',
									display: 'flex',
									flex: '0 1 160px',
								}}
							>
								{props.guild.Name}
							</div>
							<div
								style={{
									position: 'relative',
									flex: '1 1 0px',
									height: '100%',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								{
									<ArrowDropDownIcon
										style={{
											position: 'absolute',
											right: '10px',
											transition: 'transform 0.1s',
											transform: guildDropdownOpen
												? 'rotateZ(180deg)'
												: 'none',
										}}
									/>
								}
							</div>
							{guildDropdownOpen ? (
								<ClickAwayListener
									mouseEvent="onMouseDown"
									touchEvent="onTouchStart"
									onClickAway={() =>
										setGuildDropdownOpen(false)
									}
								>
									<div className={classes.guildDropdown}>
										{props.guilds?.map((guild) => {
											return (
												<div
													className={
														classes.dropdownElement
													}
													key={guild.ID}
													onClick={() =>
														(window.location.href = `/d/${guild.ID}`)
													}
												>
													<GuildIcon
														guild={guild}
														style={{
															margin: '0 10px',
															height: '27px',
															width: '27px',
														}}
													/>
													<div
														style={{
															color: '#eeeeee',
														}}
													>
														{guild.Name}
													</div>
												</div>
											)
										})}
									</div>
								</ClickAwayListener>
							) : null}
						</div>
					) : (
						<div className={classes.guildArea}>
							<Skeleton
								animation="wave"
								variant="circle"
								width="30px"
								height="30px"
								style={{ marginLeft: '10px' }}
							/>
							<Skeleton
								animation="wave"
								variant="text"
								style={{ marginLeft: '10px' }}
								width="150px"
							/>
						</div>
					)}
				</div>
				{user ? <UserDropdown user={user} /> : null}
			</div>
			<div className={classes.tabBar}>
				<Tabs
					value={pageIndex}
					indicatorColor="primary"
					textColor="primary"
					onChange={handlePageChange}
				>
					<Tab label="Plugins" />
					<Tab label="Settings" />
					<Tab label="Support" />
				</Tabs>
			</div>
		</div>
	)
}
