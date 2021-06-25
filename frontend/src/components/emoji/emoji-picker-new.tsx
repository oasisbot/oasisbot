import 'emoji-mart/css/emoji-mart.css'
import { Picker, emojiIndex } from 'emoji-mart'
import { Popover } from '@material-ui/core'
import { custom } from './custom-emojis'
import { mapToUnicode } from './twemoji'

export interface EmojiPickerProps {
	anchor: HTMLElement | undefined
	open: boolean
	onEmojiSelect: (emoji: string) => void
	onClose: () => void
}

export default function EmojiPicker({
	anchor,
	open,
	onEmojiSelect,
	onClose,
}: EmojiPickerProps) {
	return (
		<Popover
			id="emoji-picker"
			open={open}
			anchorEl={anchor}
			onClose={() => onClose()}
		>
			<Picker
				style={{ fontFamily: 'Roboto' }}
				set="twitter"
				emoji=""
				notFoundEmoji="neutral_face" // Comedy
				color="#4cc9f0"
				title="Pick an emoji..."
				custom={custom}
				onClick={(e) => {
					const result: any = emojiIndex.emojis[e.id || '']
					if (!result) {
						onEmojiSelect(
							mapToUnicode(e.id || 'regional_indicator_a')
						)
					} else {
						onEmojiSelect(result.native || result[1].native)
					}
				}}
				theme="dark"
				i18n={{ categories: { custom: 'Letters' } }}
				include={[
					'search',
					'recent',
					'custom',
					'people',
					'nature',
					'foods',
					'activity',
					'places',
					'objects',
					'symbols',
					'flags',
				]}
			/>
		</Popover>
	)
}
