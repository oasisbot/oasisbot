import {
	makeStyles,
	Theme,
	createStyles,
	ListItemText,
	List,
	ListItem,
	Popover,
} from '@material-ui/core'
import React from 'react'
import { Channel } from '../../protocol'
import Search from '../common/search'

import HashIcon from '../../assets/channels/hash.svg'

const useStyles = makeStyles<Theme>((theme: Theme) =>
	createStyles({
		channelSelect: {
			width: '300px',
			height: '350px',
			backgroundColor: theme.palette.background.paper,
			borderRadius: '5px',
			overflow: 'hidden',
			boxShadow: '0 3px 15px 4px rgb(0, 0, 0, 20%)',
		},
		list: {
			height: 300,
			overflowY: 'auto',
			display: 'flex',
			alignItems: 'center',
			flexFlow: 'column',
		},
		listText: {
			'& span': {
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
		},
	})
)

export interface ChannelSelectProps {
	channels: Channel[]
	open: boolean
	anchor: HTMLElement | undefined
	onChannelSelect?: (channel: Channel) => void
	onClose: () => void
}

export default function ChannelSelect({
	channels,
	open,
	anchor,
	onChannelSelect,
	onClose,
}: ChannelSelectProps) {
	const [displayedChannels, setDisplayedChannels] =
		React.useState<Channel[]>(channels)
	const [currentSearch, setCurrentSearch] = React.useState<string>('')
	const classes = useStyles()

	React.useEffect(() => {
		setDisplayedChannels(channels)
		filterBasedOnSearch(currentSearch)
	}, [channels])

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value
		filterBasedOnSearch(search)
		setCurrentSearch(search)
	}

	const filterBasedOnSearch = (search: string) => {
		search = search.toLowerCase().trim()
		if (search === '') setDisplayedChannels(channels)
		const modified = channels.filter((x) =>
			x.name.toLowerCase().includes(search)
		)
		setDisplayedChannels(modified)
	}

	return (
		<Popover
			id={'channel-select'}
			open={open}
			anchorEl={anchor}
			onClose={onClose}
		>
			<div className={classes.channelSelect}>
				<Search handleSearch={handleSearch} />
				<List className={classes.list}>
					{displayedChannels.length === 0 ? (
						<p>No channels to display</p>
					) : null}
					{displayedChannels.map((c) => {
						return (
							<ListItem
								button
								onClick={() =>
									onChannelSelect ? onChannelSelect(c) : {}
								}
							>
								<img
									alt="#"
									src={HashIcon}
									style={{ marginRight: '10px' }}
								/>
								<ListItemText className={classes.listText}>
									{c.name}
								</ListItemText>
							</ListItem>
						)
					})}
				</List>
			</div>
		</Popover>
	)
}
