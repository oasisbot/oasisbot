import React from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'

export interface TextAreaCodeProps {
	value: string
	onChange?: (value: string) => void
}

export default function TextAreaCode({ value, onChange }: TextAreaCodeProps) {
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (onChange) {
			onChange(event.target.value)
		}

		const syntax = document.getElementById('syntax') // Direct DOM manipulation is the easiest way to go here
		const root = document.getElementById('syntax_root')
		if (!syntax || !root) return

		event.target.style.height = 'auto'
		event.target.style.height = `${event.target.scrollHeight}px`
		syntax.style.height = 'auto'
		syntax.style.height = `${event.target.scrollHeight}px`
		root.style.height = 'auto'
		root.style.height = `${event.target.scrollHeight}px`
	}

	return (
		<div
			id="syntax_root"
			style={{
				width: '100%',
				minHeight: '300px',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<SyntaxHighlighter
				id="syntax"
				customStyle={{
					height: '100%',
					minHeight: '300px',
					backgroundColor: '#1c1d21ff',
					borderRadius: '5px',
					padding: '15px',
					border: '2px solid #161619ff',
					borderTopLeftRadius: '0',
					borderTopRightRadius: '0',
					margin: 0,
					overflow: 'hidden',
				}}
				wrapLines={true}
				wrapLongLines={true}
				language="go"
				style={dark}
			>
				{value}
			</SyntaxHighlighter>
			<textarea
				onChange={handleChange}
				autoComplete="off"
				spellCheck="false"
				value={value}
				style={{
					position: 'absolute',
					top: 0,
					minHeight: '300px',
					padding: '1em',
					lineHeight: '1.5',
					textShadow: 'none',
					margin: '0.3em',
					letterSpacing: '0.013em',
					fontSize: '13px',
					tabSize: 4,
					whiteSpace: 'pre-wrap',
					color: 'white',
					width: '100%',
					height: '100%',
					WebkitTextFillColor: 'transparent',
					background: 'none',
					outline: 'none',
					resize: 'none',
					border: 'none',
					overflow: 'hidden',
				}}
			/>
		</div>
	)
}
