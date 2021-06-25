import React from 'react'
import twemoji from 'twemoji'

export interface TwemojiProps {
	emoji: string
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

export const mapToUnicode = (item: string): string => {
	if (item.startsWith('regional')) {
		switch (item) {
			case 'regional_indicator_a':
				return '🇦'
			case 'regional_indicator_b':
				return '🇧'
			case 'regional_indicator_c':
				return '🇨'
			case 'regional_indicator_d':
				return '🇩'
			case 'regional_indicator_e':
				return '🇪'
			case 'regional_indicator_f':
				return '🇫'
			case 'regional_indicator_g':
				return '🇬'
			case 'regional_indicator_h':
				return '🇭'
			case 'regional_indicator_i':
				return '🇮'
			case 'regional_indicator_j':
				return '🇯'
			case 'regional_indicator_k':
				return '🇰'
			case 'regional_indicator_l':
				return '🇱'
			case 'regional_indicator_m':
				return '🇲'
			case 'regional_indicator_n':
				return '🇳'
			case 'regional_indicator_o':
				return '🇴'
			case 'regional_indicator_p':
				return '🇵'
			case 'regional_indicator_q':
				return '🇶'
			case 'regional_indicator_r':
				return '🇷'
			case 'regional_indicator_s':
				return '🇸'
			case 'regional_indicator_t':
				return '🇹'
			case 'regional_indicator_u':
				return '🇺'
			case 'regional_indicator_v':
				return '🇻'
			case 'regional_indicator_w':
				return '🇼'
			case 'regional_indicator_x':
				return '🇽'
			case 'regional_indicator_y':
				return '🇾'
			case 'regional_indicator_z':
				return '🇿'
		}
	}

	return item
}

export default React.memo(Twemoji)
