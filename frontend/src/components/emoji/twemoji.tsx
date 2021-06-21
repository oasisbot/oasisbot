import React from 'react'
import twemoji from 'twemoji'

export interface TwemojiProps {
	emoji: string
}

export function _TwemojiSheet({ emoji }: TwemojiProps) {
	return (
		<svg width="100%" height="100%">
			<use href={`/twemoji.svg#${emoji}`} />
		</svg>
	)
}

const Twemoji = ({ emoji }: TwemojiProps) => (
	<span
		dangerouslySetInnerHTML={{
			__html: twemoji.parse(emoji, {
				folder: 'svg',
				ext: '.svg',
			}),
		}}
	/>
)

export default React.memo(Twemoji)
export const TwemojiSheet =  React.memo(_TwemojiSheet)