import React from 'react'
import { makeStyles, createStyles, Theme, IconButton } from '@material-ui/core'
import EmojiToken from './emoji-token'
import EmojiPicker from './emoji-picker'

import AddCircleIcon from '@material-ui/icons/AddCircle'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		emojiDisplay: {
			position: 'relative',
			width: '100%',
			minHeight: '30px',
			height: '100%',
			padding: '5px',
		},
		tokenWrapper: {
			display: 'inline-block',
			padding: '2.5px',
		},
		buttonWrapper: {
			display: 'inline-block',
			width: 'auto',
			height: 'auto',
			overflow: 'hidden',
			marginRight: '10px',
		},
		buttonWrapperInner: {
			height: 30,
			width: 30,
			display: 'flex',
		},
	})
)

export interface EmojiDisplayProps {
	emojis: string[]
	max?: number
	min?: number
	onEmojisUpdate?: (emojis: string[]) => void
}

export default function EmojiDisplay({
	emojis,
	min,
	max,
	onEmojisUpdate,
}: EmojiDisplayProps) {
	const classes = useStyles()
	const [pickerAnchor, setPickerAnchor] =
		React.useState<HTMLElement | undefined>()
	const [pickerOpen, setPickerOpen] = React.useState(false)

	const emojiAdded = (emoji: string) => {
		if (!onEmojisUpdate) return
		if (max && max != 1 && emojis.length >= max) return
		if (max == 1 && min == 1) {
			// Addition means replacement in this instance
			let current = emojis.pop()
			if (current == undefined) return
			emojiRemoved(current)
		}

		const newEmojis = Array.from(emojis)
		newEmojis.push(emoji)
		onEmojisUpdate(newEmojis)
	}

	const emojiRemoved = (emoji: string) => {
		if (!onEmojisUpdate) return
		if (min && emojis.length <= min) return

		const newEmojis = Array.from(emojis)
		newEmojis.splice(newEmojis.indexOf(emoji), 1)
		onEmojisUpdate(newEmojis)
	}

	return (
		<div className={classes.emojiDisplay}>
			<div className={classes.buttonWrapper}>
				<div className={classes.buttonWrapperInner}>
					<IconButton
						size="small"
						style={{ width: '30px', height: '30px', margin: 0 }}
						onClick={(e) => {
							setPickerAnchor(e.currentTarget)
							setPickerOpen(true)
						}}
					>
						<AddCircleIcon />
					</IconButton>
				</div>
			</div>
			<EmojiPicker
				anchor={pickerAnchor}
				open={pickerOpen}
				onClose={() => setPickerOpen(false)}
				onEmojiSelect={(e) => {emojiAdded(e)}}
			/>
			{emojis.map((emoji) => {
				return (
					<div className={classes.tokenWrapper}>
						<EmojiToken
							emoji={emoji}
							onClick={() => emojiRemoved(emoji)}
						/>
					</div>
				)
			})}
		</div>
	)
}
