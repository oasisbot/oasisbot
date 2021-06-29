import React from 'react'

import {
	makeStyles,
	createStyles,
	Theme,
	IconButton,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import HashIcon from 'src/assets/channels/hash.svg'
import { ReactionData } from 'src/protocol'
import { MiniEmojiToken } from 'src/components/emoji/emoji-token'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import { GuildContext } from '../../guild-dashboard'

import PollTimer from './poll-timer'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		base: {
			position: 'relative',
			display: 'flex',
			flexFlow: 'column',
			width: '200px',
			height: '260px',
			margin: '10px',
			padding: '10px',
			borderRadius: '5px',
			boxShadow: '0px 6px 10px 1px rgb(0, 0, 0, 20%)',
			backgroundColor: theme.palette.background.paper,
			cursor: 'pointer',
			transition:
				'background-color 0.3s, box-shadow 0.3s, transform 0.3s',
			'&:hover': {
				backgroundColor: '#46474eff',
			},
		},
		empty: {
			position: 'relative',
			display: 'flex',
			flexFlow: 'column',
			width: '200px',
			height: '260px',
			margin: '10px',
			borderRadius: '5px',
			border: `4px solid ${theme.palette.background.paper}`,
			'& div': {
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
			'& h2': {
				width: '100%',
				textAlign: 'center',
				userSelect: 'none',
				color: theme.palette.background.paper,
			},
		},
		reactionStrip: {
			marginTop: 5,
			width: '180px',
			overflowX: 'scroll',
			display: 'flex',
			scrollbarColor: '#718096',
			scrollbarWidth: 'thin',
			'&::-webkit-scrollbar': {
				height: '.5rem'
			},
			'&::-webkit-scrollbar-thumb': {
				marginTop: '2px',
				backgroundColor: '#6d7178ff',
				borderRadius: '9999px'
			}
		},
		pollTimer: {
			width: '100%',
			height: '40px',
			display: 'flex',
			alignItems: 'center',
		},
	})
)

export interface PollProps {
	id: string
	channelID: string
	messagePreview: string
	isFullMessage: boolean
	reactions: ReactionData[]
	endsAt: number,
	onEnd: () => void,
}

export default function Poll({
	id,
	channelID,
	messagePreview,
	isFullMessage,
	reactions,
	endsAt,
	onEnd
}: PollProps) {
	const classes = useStyles()
	const guild = React.useContext(GuildContext)
	const [endDialogueOpen, setEndDialogueOpen] = React.useState(false)

	const handleEndDialogueClose = (yes: boolean = false) => {
		setEndDialogueOpen(false)
		if (yes) onEnd()
	}

	return (
		<div className={classes.base}>
			<div style={{ display: 'flex', flexFlow: 'row', height: '20px' }}>
				<img src={HashIcon} style={{ marginRight: 5 }} />
				<p
					style={{
						margin: 0,
						color: '#bbbbbb',
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
					}}
				>
					{guild?.Channels.find(x => x.id == channelID)?.name || ''}
				</p>
			</div>
			<p
				style={{
					height: '80px',
					overflow: 'hidden',
					marginBottom: '0px',
				}}
			>{`${messagePreview.trim()}${!isFullMessage ? '...' : ''}`}</p>
			<div className={classes.reactionStrip}>
				{reactions.map((r) => {
					return <MiniEmojiToken emoji={r.Emoji} users={r.Users} />
				})}
			</div>
			<div className={classes.pollTimer}>
				<PollTimer timestamp={endsAt} />
			</div>
			<Divider style={{ marginTop: 5 }} />
			<div style={{ position: 'absolute', bottom: 10, right: 10 }}>
				<IconButton size="small" onClick={() => setEndDialogueOpen(true)}>
					<TimerOffIcon />
				</IconButton>
			</div>
			<Dialog
				open={endDialogueOpen}
				onClose={() => handleEndDialogueClose()}
			>
				<DialogTitle>End this poll early?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{`Your poll will be ended early. This action cannot be undone.`}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleEndDialogueClose()}>
						Cancel
					</Button>
					<Button onClick={() => handleEndDialogueClose(true)}>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export interface EmptyPollProps {
	variant?: 'add'
	onSelect?: () => void
}

export function EmptyPoll({ variant, onSelect }: EmptyPollProps) {
	const classes = useStyles()

	return (
		<div className={classes.empty}>
			{variant == 'add' ? (
				<div>
					<IconButton
						size="medium"
						onClick={() => (onSelect ? onSelect() : {})}
					>
						<AddCircleIcon
							style={{
								width: '50px',
								height: '50px',
								color: '#cccccc',
							}}
						/>
					</IconButton>
				</div>
			) : (
				<h2>EMPTY</h2>
			)}
		</div>
	)
}
