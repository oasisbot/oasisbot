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
        emojiContainer: {
            width: 23,
            height: 23,
        }
	})
)

export interface EmojiTokenProps {
	emoji: string
	onClick?: () => void | undefined
}

function EmojiToken({ emoji, onClick }: EmojiTokenProps) {
	const classes = useStyles()
		console.log(emoji)
	return (
		<div className={classes.token} onClick={() => onClick ? onClick() : {}}>
            <div className={classes.emojiContainer}>
			    <Twemoji emoji={emoji} />
            </div>
		</div>
	)
}

export default React.memo(EmojiToken)
