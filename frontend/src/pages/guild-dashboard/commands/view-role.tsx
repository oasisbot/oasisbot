import React from 'react'
import { makeStyles, createStyles, Theme, Button } from '@material-ui/core'

import { Command } from '../../../protocol'
import { ValidatedString } from '../../../common'
import InputCounter from '../../../components/input/input-counter'
import CommonSettings from './common-settings'
import { GuildContext } from '../../guild-dashboard'
import RoleDisplay from '../../../components/roles/role-display'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: 'relative',
			width: '100%',
			height: '100%',
			display: 'flex',
			flex: '1',
			flexFlow: 'column',
			overflowX: 'hidden',
		},
		saveArea: {
			display: 'flex',
			width: '100%',
			flex: '1',
			flexFlow: 'column-reverse',
			paddingBottom: '20px',
		},
		save: {
			width: '100%',
			height: '80px',
			borderRadius: '5px',
			display: 'flex',
			flexFlow: 'row-reverse',
			alignItems: 'center',
			marginTop: '40px',
			padding: '0 20px',
			backgroundColor: '#161619ff',
		},
	})
)

export interface CommandViewRoleProps {
	command: Command
	editing: boolean
	onClose: () => void
	onSave: (c: Command, name?: string) => void
}

export default function CommandViewRole({
	command,
	editing,
	onClose,
	onSave,
}: CommandViewRoleProps) {
	const classes = useStyles()

	const guild = React.useContext(GuildContext)
	const [name, setName] = React.useState(command.Name)
	const [description, setDescription] = React.useState(command.Description)
	const [assignedRoles, setAssignedRoles] = React.useState(
		command.AssignedRoles
			? guild?.Roles.filter((x) =>
					command.AssignedRoles.includes(x.id)
			  ) || []
			: []
	)
	const [allowedRoles, setAllowedRoles] = React.useState(
		command.AllowedRoles
			? guild?.Roles.filter((x) => command.AllowedRoles.includes(x.id)) ||
					[]
			: []
	)
	const [forbiddenRoles, setForbiddenRoles] = React.useState(
		command.ForbiddenRoles
			? guild?.Roles.filter((x) =>
					command.ForbiddenRoles.includes(x.id)
			  ) || []
			: []
	)
	const [forbiddenChannels, setForbiddenChannels] = React.useState(
		command.ForbiddenChannels
			? guild?.Channels.filter((x) =>
					command.ForbiddenChannels.includes(x.id)
			  ) || []
			: []
	)

	return (
		<div className={classes.root}>
			<h4 style={{ color: '#bbbbbb', marginBottom: '10px' }}>
				COMMAND NAME
			</h4>
			<InputCounter
				maxLength={32}
				prefix={guild?.Prefix}
				inputProps={{
					value: name,
					onChange: (value: string) =>
						setName(ValidatedString(name, value)),
				}}
			/>
			<h4 style={{ color: '#bbbbbb', marginBottom: '10px' }}>
				COMMAND DESCRIPTION
			</h4>
			<InputCounter
				maxLength={128}
				inputProps={{
					value: description,
					onChange: (value: string) => setDescription(value),
				}}
			/>
			<h4 style={{ color: '#bbbbbb', marginBottom: '10px' }}>
				BOT GIVES ROLES:
			</h4>
			<RoleDisplay
				variant="add"
				roles={assignedRoles}
				onRolesUpdate={(roles) => setAssignedRoles(roles)}
				allRoles={guild?.Roles.filter(
					(x) => !assignedRoles.includes(x)
				)}
			/>
			<CommonSettings
				rolePool={
					guild?.Roles.filter(
						(x) =>
							!allowedRoles.includes(x) &&
							!forbiddenRoles.includes(x)
					) || []
				}
				allowedRoles={allowedRoles}
				forbiddenRoles={forbiddenRoles}
				channelPool={guild?.Channels.filter((x) => x.type == 0) || []}
				forbiddenChannels={forbiddenChannels}
				onAllowedRolesUpdate={(roles) => setAllowedRoles(roles)}
				onForbiddenRolesUpdate={(roles) => setForbiddenRoles(roles)}
				onForbiddenChannelsUpdate={(channels) =>
					setForbiddenChannels(channels)
				}
			/>
			<div className={classes.saveArea}>
				<div className={classes.save}>
					<Button
						color="inherit"
						style={{ backgroundColor: '#43b581ff' }}
						variant="contained"
						onClick={() => {
							const c: Command = {
								GuildID: command.GuildID,
								Name: name,
								Description: description,
								Enabled: true,
								Type: 3,
								Responses: [''],
								AssignedRoles: assignedRoles.map((x) => x.id),
								AllowedRoles: allowedRoles.map((x) => x.id),
								ForbiddenRoles: forbiddenRoles.map((x) => x.id),
								ForbiddenChannels: forbiddenChannels.map(
									(x) => x.id
								),
							}
							if (!editing) {
								onSave(c)
							} else {
								onSave(c, command.Name)
							}
						}}
					>
						Save
					</Button>
					<Button style={{ marginRight: '10px' }} onClick={onClose}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	)
}
