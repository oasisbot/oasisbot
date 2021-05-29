import React from 'react'
import { Button } from '@material-ui/core'

import * as common from '../../../common'
import EmojiPicker from '../../../components/emoji/emoji-picker'

export default function Polls() {
	const [emojiPickerAnchor, setEmojiPickerAnchor] =
		React.useState<HTMLElement | undefined>()
	const [emojiPickerOpen, setEmojiPickerOpen] = React.useState(false)

	const buttonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		setEmojiPickerAnchor(event.currentTarget)
		setEmojiPickerOpen(true)
	}

	React.useEffect(() => {
		const fun = async () => {
			let result = await fetch(
				`/api/plugins/polls?id=${common.GetDashboardID()}`
			)

			let data = await result.body?.getReader().read()
			if (!data) return
			// const commands = JSON.parse(new TextDecoder().decode(data.value)) as Command[]
			// setCommands(commands)
		}
		fun()
	}, [])
	return (
		<>
			<Button onClick={buttonClicked}>Wow</Button>
			<EmojiPicker
				anchor={emojiPickerAnchor}
				open={emojiPickerOpen}
				onClose={() => setEmojiPickerOpen(false)}
			/>
		</>
	)
}
