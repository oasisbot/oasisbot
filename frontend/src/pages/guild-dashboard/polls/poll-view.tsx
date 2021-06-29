import React from 'react'
import { makeStyles, createStyles, Theme, Button } from '@material-ui/core'
import { DateTimePicker } from '@material-ui/pickers'
import { Channel, Poll, PollCreate, ReactionMessage } from 'src/protocol'
import { GuildContext } from 'src/pages/guild-dashboard'

import { Header, SubText } from 'src/components/common/header'
import ChannelDisplay from 'src/components/channels/channel-display'
import TextAreaCounter from 'src/components/input/text-area-counter'
import EmojiDisplay from 'src/components/emoji/emoji-display'
import { SelectEmojiToken } from 'src/components/emoji/emoji-token'
import Info from 'src/components/labels/info'
import SaveInner from 'src/components/misc/save-inner'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: 'relative',
			width: '100%',
			height: '100%',
			display: 'flex',
			flex: '1',
			padding: '0px 20px',
			flexFlow: 'column',
			maxWidth: '1200px',
			overflowX: 'hidden',
		},
		messageBox: {
			position: 'relative',
			display: 'flex',
			width: '100%',
			minHeight: '300px',
		},
		messageBoxLeftSplit: {
			width: '50px',
			height: '100%',
			display: 'flex',
			flexFlow: 'column',
			alignItems: 'center',
			padding: '5px 0px 5px 0px',
		},
		messageBoxRightSplit: {
			flex: '1 0 auto',
			height: '100%',
			padding: '5px',
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

export interface PollViewProps {
	poll: Poll
	editing: boolean
	onClose: () => void
	onSave: (p: PollCreate) => void
}

export default function PollView({
	poll,
	editing,
	onClose,
	onSave,
}: PollViewProps) {
	const guild = React.useContext(GuildContext)
	const classes = useStyles()
	const [channel, setChannel] = React.useState(
		guild?.Channels.find((x) => x.id == poll.ChannelID)
	)
	const [pollContent, setPollContent] = React.useState(poll.Content)
	const [pollReactions, setPollReactions] = React.useState(
		poll.Reactions.map((x) => x.Emoji)
	)
	const [reactionMessages, setReactionMessages] = React.useState(
		poll.ReactionMessages
	)
	const [pollEndTime, setPollEndTime] = React.useState<any>(poll.EndsAt)

	const onChannelsUpdate = (newChannels: Channel[]) => {
		setChannel(newChannels[0])
	}

	const onEmojisUpdate = (newEmojis: string[]) => {
		if (newEmojis.some((val, i) => newEmojis.indexOf(val) !== i)) return
		setPollReactions(newEmojis)
		setReactionMessages(
			newEmojis.map((x) => {
				return {
					Emoji: x,
					Message:
						reactionMessages.find((m) => m.Emoji == x)?.Message ||
						'',
				}
			})
		)
	}

	return (
		<div className={classes.root}>
			<Header>CHANNEL</Header>
			<ChannelDisplay
				allChannels={guild?.Channels.filter((x) => x.type == 0) || []}
				channels={channel ? [channel] : []}
				onChannelsUpdate={onChannelsUpdate}
				variant={'one'}
			/>
			<Header>POLL MESSAGE</Header>
			<SubText variant="bottom">
				Your message will appear in an embed that the bot sends.
			</SubText>
			<TextAreaCounter
				textAreaProps={{
					value: pollContent,
					onChange: (value: string) => setPollContent(value),
				}}
				maxLength={1000}
				color="#fb3640"
			/>
			<Header>POLL REACTIONS</Header>
			<SubText variant="bottom">
				These will be the reaction options members will be given under
				the message. Only unique emojis are allowed.
			</SubText>
			<EmojiDisplay
				emojis={pollReactions}
				onEmojisUpdate={onEmojisUpdate}
				min={2}
				max={10}
			/>
			<Header>RESULTS</Header>
			<SubText variant="bottom">
				Define what the results message will be for each reaction and
				what will be said if it wins.
			</SubText>
			<Info style={{ marginBottom: '10px' }}>
				<>
					<p style={{ marginBottom: 0 }}>
						If no message is provided, the default poll results
						message will be used instead.
					</p>
					<p style={{ marginTop: 0 }}>
						Include <b>[emoji]</b> to display the number of members
						that reacted with that emoji in the poll results.
					</p>
				</>
			</Info>
			<ReactionMessageBox
				messages={reactionMessages}
				onMessagesChange={setReactionMessages}
			/>
			<Header>ENDS AT</Header>
			<SubText variant="bottom">
				This is the time that the poll will end and results will be
				collected.
			</SubText>
			<DateTimePicker
				value={pollEndTime}
				onChange={setPollEndTime}
				color="primary"
				minDate={new Date()}
				maxDate={addMonths(new Date(), 6)}
			/>
			<SaveInner
				saveText='Create Poll'
				variant='full-save'
				onSave={() => {
					const p: PollCreate = {
						ChannelID: channel?.id || '',
						Content: pollContent,
						Reactions: pollReactions.map((x) => {
							return {
								Emoji: x,
								Users: undefined,
							}
						}),
						ReactionMessages: reactionMessages,
						EndsAt: Math.floor(pollEndTime.getTime() / 1000)
					}
					onSave(p)
				}}
				onCancel={onClose}
			/>
		</div>
	)
}

// https://stackoverflow.com/a/58186210
function addMonths(date: Date, months: number) {
	var month = (date.getMonth() + months) % 12
	var last = new Date(date.getFullYear(), month + 1, 0)
	if (date.getDate() <= last.getDate()) {
		date.setMonth(month)
	} else {
		date.setMonth(month, last.getDate())
	}

	return date
}

interface ReactionMessageBoxProps {
	messages: ReactionMessage[]
	onMessagesChange: (messages: ReactionMessage[]) => void
}

const ReactionMessageBox = ({
	messages,
	onMessagesChange,
}: ReactionMessageBoxProps) => {
	const [selected, setSelected] = React.useState(messages[0].Emoji)

	const onChange = (value: string) => {
		let newMessages = Array.from(messages)
		let target = newMessages.find((x) => x.Emoji == selected)
		if (!target) return
		target.Message = value
		onMessagesChange(newMessages)
	}

	const classes = useStyles()
	return (
		<div className={classes.messageBox}>
			<div className={classes.messageBoxLeftSplit}>
				{messages.map((m) => {
					return (
						<div style={{ padding: '3px' }}>
							<SelectEmojiToken
								emoji={m.Emoji}
								selected={selected == m.Emoji}
								onSelect={() => {
									setSelected(m.Emoji)
								}}
							/>
						</div>
					)
				})}
			</div>
			<div className={classes.messageBoxRightSplit}>
				<TextAreaCounter
					textAreaProps={{
						value:
							messages.find((m) => m.Emoji == selected)
								?.Message || '',
						onChange: onChange,
						style: { flex: '1 1 auto', maxHeight: '1000px' },
					}}
					maxLength={1000}
					color="#fb3640"
				/>
			</div>
		</div>
	)
}
