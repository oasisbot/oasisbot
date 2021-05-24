import React from 'react'
import {
	makeStyles,
	createStyles,
	Theme,
	Button,
	Avatar,
	ClickAwayListener,
	ListItem,
	ListItemText,
	Divider,
} from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { User } from '../../protocol'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		userContainer: {
			position: 'relative',
			display: 'flex',
			flexFlow: 'row-reverse',
			alignItems: 'center',
			right: '0',
			height: '50px',
			borderRadius: '5px',
			cursor: 'pointer',
		},
		userAvatar: {
			height: '40px',
			width: '40px',
			marginLeft: '10px',
			[theme.breakpoints.down('xs')]: {
				height: '30px',
				width: '30px',
			},
		},
		userText: {
			marginLeft: '10px',
			marginRight: '3px',
			maxWidth: '200px',
			color: '#eeeeee',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			[theme.breakpoints.down('sm')]: {
				display: 'none',
			},
		},
		dropdown: {
			position: 'absolute',
			width: '100%',
			minWidth: '120px',
			maxWidth: '170px',
			top: '50px',
			zIndex: 2,
			borderRadius: '5px',
			overflow: 'hidden',
			backgroundColor: theme.palette.background.paper,
			boxShadow: '0 3px 15px 4px rgb(0, 0, 0, 20%)',
		},
	})
)

export interface UserDropdownProps {
	user: User
	style?: React.CSSProperties | undefined
}

export default function UserDropdown({
	user,
	style = undefined,
}: UserDropdownProps) {
	const history = useHistory()
	const classes = useStyles()
	const [dropdownOpen, setDropdownOpen] = React.useState(false)

	return (
		<div
			style={style}
			className={classes.userContainer}
			onClick={() => setDropdownOpen(true)}
		>
			<ArrowDropDownIcon />
			<h3 className={classes.userText}>{user.Username}</h3>
			<Avatar
				className={classes.userAvatar}
				src={`https://cdn.discordapp.com/avatars/${user.ID}/${user.Avatar}`}
			/>
			{dropdownOpen ? (
				<ClickAwayListener
					mouseEvent="onMouseDown"
					touchEvent="onTouchStart"
					onClickAway={() => setDropdownOpen(false)}
				>
					<div className={classes.dropdown}>
						<ListItem
							button
							onClick={() => {
								history.push('/dashboard')
								setDropdownOpen(false)
							}}
						>
							<ListItemText primary="Dashboard" />
						</ListItem>
						<Divider />
						<ListItem button>
							<ListItemText primary="Logout" />
						</ListItem>
					</div>
				</ClickAwayListener>
			) : null}
		</div>
	)
}
