import React from 'react'
import { makeStyles, createStyles, Theme, Divider } from '@material-ui/core'
import { PollPreview } from 'src/protocol'

import { SecondsTimestamp } from 'src/components/common/clock'
import UIPoll, { EmptyPoll } from './poll'
import PollView from './poll-view'
import UpdateIcon from '@material-ui/icons/Update'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			maxWidth: '1200px',
			display: 'flex',
			flex: '1',
			flexFlow: 'column',
			padding: '0px 20px',
			overflowX: 'hidden',
			marginTop: '15px',
		},
		cornerItem: {
			width: '100%',
			display: 'flex',
			flexFlow: 'row',
		},
		pollContainer: {
			margin: 0,
			display: 'flex',
			height: 'auto',
			width: '100%',
			justifyContent: 'center',
			flexWrap: 'wrap',
		},
	})
)

export interface MainProps {
	nextCycleTimestamp: number
	polls: PollPreview[]
	onPollEnd: (poll: PollPreview) => void
	onPollSelect: (poll: PollPreview | undefined) => void
}

export default function Main({
	nextCycleTimestamp,
	polls,
	onPollEnd,
	onPollSelect,
}: MainProps) {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<h2 style={{ color: '#dddddd' }}>ONGOING POLLS</h2>
			<div className={classes.cornerItem}>
				<UpdateIcon style={{ marginRight: '10px' }} />
				<SecondsTimestamp
					timestamp={nextCycleTimestamp}
					preText={'All polls will be evaluated in '}
					postText={'s'}
					zeroText={
						'Polls are being evaluated. Refresh to see changes'
					}
					style={{
						fontWeight: 'normal',
						margin: 0,
						color: '#bbbbbb',
					}}
				/>
			</div>
			<Divider style={{ marginTop: '20px', marginBottom: '10px' }} />
			<div className={classes.pollContainer}>
				{polls.sort((a, b) => a.EndsAt - b.EndsAt).map((poll) => {
					return (
						<UIPoll
							id={poll.ID}
							channelID={poll.ChannelID}
							messagePreview={poll.MessagePreview}
							isFullMessage={poll.IsFullMessage}
							reactions={poll.Reactions}
							endsAt={poll.EndsAt}
							onEnd={() => onPollEnd(poll)}
						/>
					)
				})}
				{polls.length < 5 ? (
					<EmptyPoll
						variant="add"
						onSelect={() => onPollSelect(undefined)}
					/>
				) : undefined}
				{polls.length == 0 ? (
					<>
						<EmptyPoll />
						<EmptyPoll />
						<EmptyPoll />
						<EmptyPoll />
					</>
				) : polls.length == 1 ? (
					<>
						<EmptyPoll />
						<EmptyPoll />
						<EmptyPoll />
					</>
				) : polls.length == 2 ? (
					<>
						<EmptyPoll />
						<EmptyPoll />
					</>
				) : polls.length == 3 ? (
					<>
						<EmptyPoll />
					</>
				) : undefined}
			</div>
		</div>
	)
}
