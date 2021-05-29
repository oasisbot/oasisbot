import React from 'react'
import twemoji from 'twemoji'

export interface TwemojiProps {
	emoji: string
}

function Twemoji({ emoji }: TwemojiProps) {
	return (
		<svg width="100%" height="100%">
			<use
				href={`/twemoji.svg#${emoji}`}
			/>
		</svg>
	)
}

export default React.memo(Twemoji)
