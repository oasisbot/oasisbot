import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import * as common from '../../../common'
import { Command } from '../../../protocol'
import Dots from '../../../components/misc/dots'
import Main from './main'
import { GuildContext } from '../../guild-dashboard'
import CommandView from './command-view'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			maxWidth: '1200px',
			display: 'flex',
			flex: '1',
			flexFlow: 'column',
			alignItems: 'center',
			padding: '0px 20px',
			overflowX: 'hidden',
		},
	})
)

interface CommandUpdateMutation {
	command: Command
	name: string
}

export default function Commands() {
	const queryClient = useQueryClient()
	const guild = React.useContext(GuildContext)
	const { data: commands } = useQuery(
		'plugin-commands-commands',
		async () => {
			return await fetch(
				`/api/plugins/commands?id=${common.GetDashboardID()}`
			).then((c) => c.json())
		}
	)
	const updateMutation = useMutation(
		(c: CommandUpdateMutation) =>
			axios.put(
				`/api/plugins/commands/${c.name}?id=${guild?.ID}`,
				c.command
			),
		{
			onSuccess: (data, variables) => {
				const existing: any = queryClient.getQueryData(
					'plugin-commands-commands'
				)
				const index = existing.findIndex(
					(x: any) => x.Name == variables.name
				)
				existing[index] = variables.command
				queryClient.setQueryData('plugin-commands-commands', existing)
			},
		}
	)
	const createMutation = useMutation(
		(c: Command) => axios.post(`/api/plugins/commands?id=${guild?.ID}`, c),
		{
			onSuccess: (data, variables) => {
				const existing: any = queryClient.getQueryData(
					'plugin-commands-commands'
				)
				existing.push(variables)
			},
		}
	)
	const deleteMutation = useMutation(
		(c: Command) =>
			axios.delete(`/api/plugins/commands/${c.Name}?id=${guild?.ID}`),
		{
			onSuccess: (data, variables) => {
				const existing: any = queryClient.getQueryData(
					'plugin-commands-commands'
				)
				existing.splice(
					existing.findIndex((x: any) => x.Name === variables.Name),
					1
				)
			},
		}
	)

	const classes = useStyles()
	const [currentEdit, setCurrentEdit] = React.useState<boolean | undefined>()
	const [currentCommand, setCurrentCommand] =
		React.useState<Command | undefined>()

	const onCommandSave = async (c: Command, originalName: string = c.Name) => {
		if (currentEdit === undefined) return
		if (!currentEdit) {
			createMutation.mutate(c)
		} else {
			await updateMutation.mutateAsync({ command: c, name: originalName })
			setCurrentCommand(undefined)
		}
	}

	const onClose = () => {
		setCurrentEdit(undefined)
		setCurrentCommand(undefined)
	}

	const onCommandSelect = (c: Command | undefined, option?: number) => {
		if (!c) {
			const command: Command = {
				GuildID: guild?.ID || '',
				Name: 'new-command',
				Description: '',
				Enabled: true,
				Type: option || 0,
				Responses: [''],
				AssignedRoles: [],
				PostReaction: '',
				AllowedRoles: [],
				ForbiddenRoles: [],
				ForbiddenChannels: [],
			}
			if (option == 4) {
				command.Responses[0] = `{{/*
GO TEMPLATE EDITOR V2
Helpful links:
[custom command documentation] https://docs.oasisbot.xyz/dashboard-and-permissions#bot-masters
[Go's templating library] https://golang.org/pkg/text/template/
*/}}`
			}
			setCurrentEdit(false)
			setCurrentCommand(command)
		} else {
			setCurrentEdit(true)
			setCurrentCommand(c)
		}
	}

	return (
		<div className={classes.root}>
			{commands && !currentCommand ? (
				<>
					<Main
						commands={commands}
						prefix={guild?.Prefix || '&'}
						onCommandUpdate={(c: Command) =>
							updateMutation.mutate({ command: c, name: c.Name })
						}
						onCommandDelete={deleteMutation.mutate}
						onCommandSelect={onCommandSelect}
					/>
				</>
			) : currentCommand ? (
				<CommandView
					command={currentCommand}
					editing={currentEdit || false}
					onClose={onClose}
					onSave={onCommandSave}
				/>
			) : (
				<div
					style={{
						height: '100%',
						display: 'flex',
						flex: '1',
						alignItems: 'center',
					}}
				>
					<Dots />
				</div>
			)}
		</div>
	)
}
