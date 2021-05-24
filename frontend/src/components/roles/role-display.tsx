import React from 'react'
import {
	makeStyles,
	createStyles,
	Theme,
	Chip,
	IconButton,
} from '@material-ui/core'

import { Role } from '../../protocol'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import ClearIcon from '@material-ui/icons/Clear'
import { LightOrDarkColorNum } from '../../common'
import RoleSelect from './role-select'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		roleDisplay: {
			position: 'relative',
			width: '100%',
			minHeight: '50px',
			height: '100%',
			background: '#161718f0',
			border: '2px solid #161619ff',
			borderRadius: '5px',
			padding: '10px',
		},
		roleItem: {
			display: 'inline-block',
			padding: '5px',
		},
		chip: {
			'&:hover $clearIcon': {
				display: 'inline-block',
			},
		},
		clearIcon: {
			display: 'none',
			position: 'absolute',
			left: 0,
			width: '15px',
			height: '15px',
			argin: '5px 0',
		},
		dark: {
			color: '#111111',
		},
		disabledCover: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			cursor: 'not-allowed',
			backgroundColor: '#161718f0',
			opacity: '50%',
		},
	})
)

export interface RoleDisplayProps {
	roles: Role[]
	allRoles?: Role[]
	variant?: 'disabled' | 'add' | undefined
	onRolesUpdate?: (roles: Role[]) => void
}

export default function RoleDisplay({
	allRoles,
	roles,
	variant = undefined,
	onRolesUpdate,
}: RoleDisplayProps) {
	const classes = useStyles()
	const [roleSelectOpen, setRoleSelectOpen] = React.useState(false)
	const [roleSelectAnchor, setRoleSelectAnchor] =
		React.useState<HTMLElement | undefined>()

	const addClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		setRoleSelectAnchor(event.currentTarget)
		setRoleSelectOpen(true)
	}

	const roleAdded = (role: Role) => {
		if (!onRolesUpdate) return
		const newRoles = Array.from(roles)
		newRoles.push(role)
		onRolesUpdate(newRoles)
	}

	const roleRemoved = (role: Role) => {
		if (!onRolesUpdate) return
		const newRoles = Array.from(roles)
		newRoles.splice(newRoles.indexOf(role), 1)
		onRolesUpdate(newRoles)
	}

	return (
		<div className={classes.roleDisplay}>
			{variant == 'add' ? (
				<IconButton
					style={{ color: '#dddddd', marginTop: '0px' }}
					size="small"
					onClick={addClicked}
				>
					<AddCircleIcon />
				</IconButton>
			) : null}
			{roles.map((role) => {
				return (
					<div key={role.id} className={classes.roleItem}>
						<Chip
							className={classes.chip}
							avatar={
								<div
									style={{
										position: 'relative',
										display: 'flex',
										alignItems: 'center',
										width: '15px',
									}}
								>
									<svg
										style={{
											width: '15px',
											height: '15px',
										}}
									>
										<circle
											cx="7.5"
											cy="7.5"
											r="7.5"
											fill={
												role.color.toString(16) != '0'
													? typeof role.color ==
													  'number'
														? `#${role.color.toString(
																16
														  )}`
														: role.color
													: '#757575ff'
											}
										></circle>
									</svg>
									<ClearIcon
										onClick={() => roleRemoved(role)}
										className={`${classes.clearIcon} ${
											!LightOrDarkColorNum(role.color)
												? classes.dark
												: ''
										}`}
										color="inherit"
									/>
								</div>
							}
							variant="outlined"
							style={{
								borderWidth: '2px',
								paddingLeft: '3px',
								borderColor:
									typeof role.color == 'number'
										? `#${role.color.toString(16)}`
										: role.color,
							}}
							label={role.name}
						/>
					</div>
				)
			})}
			{variant == 'disabled' ? (
				<div className={classes.disabledCover} />
			) : variant == 'add' ? (
				<RoleSelect
					roles={
						allRoles
							? allRoles.filter(
									(x) =>
										roles.find((y) => y.id == x.id) ==
										undefined
							  )
							: []
					}
					open={roleSelectOpen}
					anchor={roleSelectAnchor}
					onRoleSelect={roleAdded}
					onClose={() => setRoleSelectOpen(false)}
				/>
			) : null}
		</div>
	)
}
