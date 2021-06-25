import React from 'react'
import { PollLanding, PollPreview, Poll, PollCreate } from 'src/protocol'

import Dots from '../../../components/misc/dots'
import { GuildContext } from 'src/pages/guild-dashboard'
import * as common from 'src/common'

import Main from './main'
import PollView from './poll-view'

export default function Polls() {
	const guild = React.useContext(GuildContext)
	const [landing, setLanding] = React.useState<PollLanding | undefined>()
	const [currentEdit, setCurrentEdit] = React.useState<boolean | undefined>()
	const [currentPoll, setCurrentPoll] = React.useState<Poll | undefined>()

	React.useEffect(() => {
		const fun = async () => {
			let result = await fetch(
				`/api/plugins/polls?id=${common.GetDashboardID()}`
			)

			let data = await result.body?.getReader().read()
			if (!data) return
			const final = JSON.parse(new TextDecoder().decode(data.value)) as PollLanding
			setLanding(final)
			console.log(final)
		}
		fun()
	}, [])

	if (!guild) return null

	const onPollSelect = (p: PollPreview | undefined) => {
		if (!p) {
			const poll: Poll = {
				ID: '',
				ChannelID: guild?.Channels.find((x) => true)?.id || '',
				Content: 'Type your poll message here!',
				Reactions: [
					{ Emoji: '👍', Users: undefined },
					{ Emoji: '👎', Users: undefined },
				],
				ReactionMessages: [
					{
						Emoji: '👍',
						Message: `:) Looks like [👍] members say it's good!`,
					},
					{
						Emoji: '👎',
						Message: `:( Looks like [👎] members say it's bad!`,
					},
				],
				EndsAt: new Date(new Date().getTime() + 3600000)
			}
			setCurrentEdit(false)
			setCurrentPoll(poll)
		}
	}

	const onSave = (p: PollCreate) => {
		if (currentEdit === undefined) return
		if (!currentEdit) {
			var xhr = new XMLHttpRequest()
			xhr.open('POST', `/api/plugins/polls?id=${guild.ID}`)
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					setCurrentPoll(undefined)
					var json = JSON.parse(xhr.responseText) as PollLanding
					setLanding(json)
				}
			}
			var json = JSON.stringify(p)
			xhr.send(json)
		}
	}

	const onClose = () => {
		setCurrentEdit(undefined)
		setCurrentPoll(undefined)
	}

	return (
		<>
			{landing && !currentPoll ? (
				<Main
					polls={landing.Polls || []}
					nextCycleTimestamp={landing.NextPollCycle}
					onPollSelect={onPollSelect}
					onPollEnd={() => {}}
				/>
			) : currentPoll ? (
				<PollView
					poll={currentPoll}
					editing={currentEdit || false}
					onClose={onClose}
					onSave={onSave}
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
		</>
	)
}
