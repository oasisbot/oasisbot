import React from 'react'
import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core'

import HashIcon from '../../assets/channels/hash.svg'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Channel } from '../../protocol'
import ChannelSelect from './channel-select'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		channelDisplay: {
			position: 'relative',
			width: '100%',
			minHeight: '50px',
			height: '100%',
			padding: '10px',
		},
		channelObject: {
			height: '50px',
			display: 'inline-block',
			verticalAlign: 'top',
			padding: '5px',
		},
		channelObjectContent: {
			height: '100%',
			display: 'flex',
			flexFlow: 'row',
			padding: '15px',
			alignItems: 'center',
			backgroundColor: '#161718f0',
			borderRadius: '10px',
			cursor: 'pointer',
			boxSizing: 'border-box',
			'& p': {
				margin: 0,
				fontWeight: 'bold',
				color: '#dddddd',
				'&:hover': {
					textDecoration: 'line-through',
				},
			},
		},
	})
)

export interface ChannelDisplayProps {
	channels: Channel[]
	allChannels?: Channel[]
	onChannelsUpdate?: (channels: Channel[]) => void
}

export default function ChannelDisplay({
	channels,
	allChannels = [],
	onChannelsUpdate,
}: ChannelDisplayProps) {
	const classes = useStyles()
	const [channelSelectOpen, setChannelSelectOpen] = React.useState(false)
	const [channelSelectAnchor, setChannelSelectAnchor] =
		React.useState<HTMLElement | undefined>()

	const addClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		setChannelSelectAnchor(event.currentTarget)
		setChannelSelectOpen(true)
	}

	const channelAdded = (channel: Channel) => {
		if (!onChannelsUpdate) return
		const newChannels = Array.from(channels)
		newChannels.push(channel)
		onChannelsUpdate(newChannels)
	}

	const channelRemoved = (channel: Channel) => {
		if (!onChannelsUpdate) return
		const newChannels = Array.from(channels)
		newChannels.splice(newChannels.indexOf(channel), 1)
		onChannelsUpdate(newChannels)
	}

	return (
		<div className={classes.channelDisplay}>
			<div style={{ height: '50px', display: 'inline-block' }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<IconButton
						style={{ color: '#dddddd' }}
						size="small"
						onClick={addClicked}
					>
						<AddCircleIcon />
					</IconButton>
				</div>
			</div>
			{channels.map((c) => {
				return (
					<div className={classes.channelObject}>
						<div className={classes.channelObjectContent}>
							<img
								alt="#"
								src={HashIcon}
								style={{ marginRight: '5px' }}
							/>
							<p onClick={() => channelRemoved(c)}>{c.name}</p>
						</div>
					</div>
				)
			})}
			<ChannelSelect
				channels={
					allChannels
						? allChannels.filter(
								(x) =>
									channels.find((y) => y.id === x.id) ===
									undefined
						  )
						: []
				}
				open={channelSelectOpen}
				anchor={channelSelectAnchor}
				onChannelSelect={channelAdded}
				onClose={() => setChannelSelectOpen(false)}
			/>
		</div>
	)
}
