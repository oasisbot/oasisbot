import React from 'react'
import { makeStyles, createStyles, Theme, Popover } from '@material-ui/core'
import json from './data/emoji.json'
import twemoji from 'twemoji'
import { TwemojiSheet } from './twemoji'
import { List, ListRowProps } from 'react-virtualized'

import Search from '../common/search'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		emojiPicker: {
			position: 'relative',
			width: '351px',
			height: '470px',
			borderRadius: '5px',
			background: '#2b2c32ff',
			display: 'flex',
		},
		topSplit: {
			position: 'relative',
			width: '100%',
			height: '100%',
		},
		listWrapper: {
			paddingLeft: '5px',
			flexWrap: 'wrap',
		},
		emojiRow: {
			display: 'flex',
		},
		emojiCateogry: {
			padding: '5px',
			display: 'flex',
			alignItems: 'center',
			'& h3': {
				textTransform: 'uppercase',
			},
		},
		emoji: {
			position: 'relative',
			width: '11.111%',
			height: '100%',
			boxSizing: 'border-box',
			borderRadius: '5px',
			'&:hover': {
				background: '#666666',
			},
		},
		tooltip: {
			position: 'absolute',
			left: 0,
			bottom: 0,
			width: '100%',
			height: '70px',
			background: '#161619ff',
			borderBottomLeftRadius: 5,
			borderBottomRightRadius: 5,
			display: 'flex',
			flexFlow: 'row',
			alignItems: 'center',
			padding: 10,
		},
	})
)

export interface EmojiPickerProps {
	anchor: HTMLElement | undefined
	open: boolean
	onEmojiSelect: (emoji: string) => void
	onClose: () => void
}

export default function EmojiPicker({
	anchor,
	open,
	onClose,
	onEmojiSelect
}: EmojiPickerProps) {
	const emojis = collectionToBlock()
	const list: React.RefObject<List> = React.createRef()
	const [currentHover, setCurrentHover] = React.useState<any>(undefined)
	const [shiftDown, setShiftDown] = React.useState(false)

	React.useEffect(() => {
		document.addEventListener('keydown', event => {
			if (event.shiftKey) {
				setShiftDown(true)
			}
		})
		document.addEventListener('keyup', event => {
			if (event.keyCode == 16) {
				setShiftDown(false)
			}
		})
	}, [])

	const renderRow = ({ key, index, isScrolling, style }: ListRowProps) => {
		return (
			<div className={classes.emojiRow} key={key} style={style}>
				{emojis[index].type === 'category' && emojis[index].value ? (
					<div className={classes.emojiCateogry}>
						<h3>{emojis[index].value}</h3>
					</div>
				) : (
					emojis[index].type !== 'category' &&
					emojis[index].map((emoji: any) => {
						if (emoji) {
							return (
								<EmojiItem
									emoji={emoji}
									classes={classes}
									onHover={(e: any) => setCurrentHover(e)}
									onClick={(e: any) => {
										onEmojiSelect(twemoji.convert.fromCodePoint(e.code_points.output))
										if (!shiftDown) {
											onClose()
										}
									}}
								/>
							)
						}
					})
				)}
			</div>
		)
	}

	const classes = useStyles()
	return (
		<Popover
			id="emoji-picker"
			open={open}
			anchorEl={anchor}
			onClose={() => onClose()}
		>
			<div className={classes.emojiPicker}>
				<div className={classes.topSplit}>
					<Search handleSearch={() => {}} />
					<div className={classes.listWrapper}>
						<List
							height={350}
							width={346}
							rowHeight={36}
							rowRenderer={renderRow}
							ref={list}
							rowCount={emojis.length}
							style={{ bottom: 0 }}
						/>
					</div>
				</div>
				<Tooltip emoji={currentHover} />
			</div>
		</Popover>
	)
}

export interface TooltipProps {
	emoji: any
}

function Tooltip({ emoji }: TooltipProps) {
	const classes = useStyles()
	return (
		<div className={classes.tooltip}>
			{emoji ? (
				<>
					<div style={{ width: '35px', height: '35px' }}>
						<TwemojiSheet emoji={emoji.code_points.output} />
					</div>
					<div
						style={{
							marginLeft: '10px',
							height: '35px',
							width: '280px',
							display: 'flex',
							justifyContent: 'center',
							flexFlow: 'column',
						}}
					>
						<h4
							style={{
								margin: 0,
								textTransform: 'uppercase',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{emoji.name}
						</h4>
						<p style={{ margin: 0, color: '#aaaaaa' }}>
							{emoji.shortname}
						</p>
					</div>
				</>
			) : undefined}
		</div>
	)
}

const EmojiItem = React.memo(({ emoji, classes, onHover, onClick }: any) => {
	return (
		<div
			className={classes.emoji}
			onMouseEnter={() => onHover(emoji)}
			onClick={(e) => onClick(emoji)}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					padding: '3.5px',
				}}
			>
				<TwemojiSheet emoji={emoji.code_points.output} />
			</div>
		</div>
	)
})

function collectionToBlock() {
	let emojisBlocks: any[] = []
	let emojisByCategoryByBlock: any = {}
	let blockByCategory: any = {}

	Object.entries(json)
		.sort((a, b) => a[1].order - b[1].order)
		.forEach((emojiTup) => {
			let emoji = emojiTup[1]
			let category = emoji.category

			if (emoji.diversity != null || emoji.display == 0) {
				return
			}

			if (!blockByCategory[category]) {
				blockByCategory[category] = 0
			}
			let block = blockByCategory[category]

			if (!emojisByCategoryByBlock[category]) {
				emojisByCategoryByBlock[category] = []
			}
			if (!emojisByCategoryByBlock[category][block]) {
				emojisByCategoryByBlock[category].push([])
			}
			emojisByCategoryByBlock[category][block].push(emoji)

			if (emojisByCategoryByBlock[category][block].length == 9) {
				blockByCategory[category]++
			}
		})

	Object.keys(emojisByCategoryByBlock).forEach((category) => {
		emojisBlocks.push({ type: 'category', value: category })
		emojisBlocks = emojisBlocks.concat(emojisByCategoryByBlock[category])
	})

	return emojisBlocks
}

function search(query: string) {
	query = query.toLocaleLowerCase().replace(':', '')

	let candidates: any[] = []
	let maxResults = 27
}
