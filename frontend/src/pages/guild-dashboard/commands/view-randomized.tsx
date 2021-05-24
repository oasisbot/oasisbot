import React from 'react'
import {
	makeStyles,
	createStyles,
	Theme,
	Button,
	Divider,
} from '@material-ui/core'

import { Command } from '../../../protocol'
import { ValidatedString } from '../../../common'
import InputCounter from '../../../components/input/input-counter'
import TextAreaCounter from '../../../components/input/text-area-counter'
import { GuildContext } from '../../guild-dashboard'
import CommonSettings from './common-settings'

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

export interface CommandViewRandomizedProps {
	command: Command
	editing: boolean
	onClose: () => void
	onSave: (c: Command, name?: string) => void
}

export default function CommandViewRandomized({
	command,
	editing,
	onClose,
	onSave,
}: CommandViewRandomizedProps) {
	const classes = useStyles()

	const guild = React.useContext(GuildContext)
	const [name, setName] = React.useState(command.Name)
	const [description, setDescription] = React.useState(command.Description)
	const [responses, setResponses] = React.useState(command.Responses)
	const [responseValues, setResponseValues] = React.useState(
		command.Responses
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
				RESPONSES:
			</h4>
			{responses.map((_, index) => {
				return (
					<>
						{index != 0 ? (
							<div>
								<div
									style={{
										display: 'flex',
										flexFlow: 'row',
										alignItems: 'center',
									}}
								>
									<h4
										style={{ color: '#bbbbbb' }}
									>{`Response ${index + 1}`}</h4>
									<div style={{ margin: '0 10px' }}>
										<Button
											onClick={() => {
												const newResponses =
													responses.filter(
														(_, i) => i != index
													)
												const newResponseValues =
													responseValues.filter(
														(_, i) => i != index
													)
												setResponseValues(
													newResponseValues
												)
												setResponses(newResponses)
											}}
										>
											Remove
										</Button>
									</div>
									<Divider style={{ flex: '1' }} />
								</div>
							</div>
						) : null}
						<TextAreaCounter
							variant="expandable"
							textAreaProps={{
								value: responseValues[index],
								onChange: (value: string) => {
									const list = responseValues.map((re, i) => {
										if (i == index) {
											return value
										} else {
											return re
										}
									})
									console.log(list[0])
									setResponseValues(list)
								},
							}}
							maxLength={2000}
							color="#fb3640"
						/>
					</>
				)
			})}
			<div style={{ marginTop: '10px' }}>
				<Button
					variant="outlined"
					onClick={() => {
						const modified = Array.from(responseValues)
						modified.push('')
						setResponses(modified)
						setResponseValues(modified)
					}}
				>
					Add Response
				</Button>
			</div>
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
								Type: 1,
								Responses: responseValues,
								AssignedRoles: [],
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
