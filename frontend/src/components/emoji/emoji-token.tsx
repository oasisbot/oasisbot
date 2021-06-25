import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import Twemoji from './twemoji'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		token: {
			width: 50,
			height: 50,
			borderRadius: 7,
			borderColor: '#414246ff',
			border: '2px solid',
			transition: 'background 0.15s',
			'&:hover': {
				background: '#414246aa',
			},
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		selectToken: {
			width: 40,
			height: 40,
			borderRadius: 7,
			cursor: 'pointer',
			borderColor: '#414246ff',
			border: '2px solid',
			transition: 'background 0.15s',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		selected: {
			background: '#414246ff',
			boxShadow: '0 0 4px rgb(0, 0, 0, 50%)'
		},
		emojiContainer: {
			width: 23,
			height: 23,
		},
		miniToken: {
			minWidth: 30,
			height: 30,
			borderRadius: 7,
			transition: 'background 0.15s',
			'&:hover': {
				background: '#61626bff',
			},
			display: 'flex',
			alignItems: 'center',
			'& p': {
				marginRight: 5,
			},
		},
		miniEmojiContainer: {
			width: 17,
			height: 17,
			marginLeft: '7px',
			marginRight: '7px',
		},
	})
)

export interface EmojiTokenProps {
	emoji: string
	onClick?: () => void | undefined
}

function EmojiToken({ emoji, onClick }: EmojiTokenProps) {
	const classes = useStyles()
	return (
		<div
			className={classes.token}
			style={onClick ? {cursor: 'pointer'} : {}}
			onClick={() => (onClick ? onClick() : {})}
		>
			<div className={classes.emojiContainer}>
				<Twemoji emoji={emoji} />
			</div>
		</div>
	)
}

export default React.memo(EmojiToken)

export interface MiniEmojiTokenProps {
	emoji: string
	users?: number
}

function _MiniEmojiToken({ emoji, users = 0 }: MiniEmojiTokenProps) {
	const classes = useStyles()
	return (
		<div className={classes.miniToken}>
			<div className={classes.miniEmojiContainer}>
				<Twemoji emoji={emoji} />
			</div>
			{users != 0 ? <p>{users}</p> : undefined}
		</div>
	)
}

export const MiniEmojiToken = React.memo(_MiniEmojiToken)

interface SelectEmojiProps {
	emoji: string
	selected: boolean
	onSelect: () => void
}

const _SelectEmojiToken = ({ emoji, selected, onSelect }: SelectEmojiProps) => {
	const classes = useStyles()
	return (
		<div className={`${classes.selectToken} ${selected ? classes.selected : ''}`} onClick={() => onSelect()}>
			<div className={classes.emojiContainer}>
				<Twemoji emoji={emoji} />
			</div>
		</div>
	)
}

export const SelectEmojiToken = React.memo(_SelectEmojiToken)
