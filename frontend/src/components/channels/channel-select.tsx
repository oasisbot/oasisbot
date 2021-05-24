import {
	makeStyles,
	Theme,
	createStyles,
	Input,
	ListItemText,
	List,
	ListItem,
	Popover,
} from '@material-ui/core'
import React from 'react'
import { Channel } from '../../protocol'

import SearchIcon from '@material-ui/icons/Search'
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
		search: {
			width: '100%',
			height: '50px',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			flexFlow: 'row',
			boxShadow: '0 3px 10px 2px rgb(0, 0, 0, 20%)',
		},
		searchLeft: {
			height: '100%',
			width: '50px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		searchRight: {
			height: '100%',
			flex: '1',
			display: 'flex',
			alignItems: 'center',
			paddingRight: '20px',
		},
		input: {
			width: '100%',
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
				<div className={classes.search}>
					<div className={classes.searchLeft}>
						<SearchIcon />
					</div>
					<div className={classes.searchRight}>
						<Input
							className={classes.input}
							color="secondary"
							placeholder="Search"
							onChange={handleSearch}
						/>
					</div>
				</div>
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
