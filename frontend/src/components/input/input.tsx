import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: {
			width: '100%',
			height: '50px',
			borderRadius: '5px',
			backgroundColor: '#1c1d21ff',
			border: '2px solid #161619ff',
			outline: 'none',
			padding: '15px',
			fontSize: '15px',
			color: '#dedede',
		},
	})
)

export interface InputProps {
	value?: string | undefined
	style?: React.CSSProperties | undefined
	className?: string | undefined
	onChange?: (value: string) => void | undefined
}

export default function Input({
	value,
	style,
	className,
	onChange,
}: InputProps) {
	const classes = useStyles()

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(event.target.value)
		}
	}

	return (
		<input
			className={`${classes.input} ${className}`}
			style={style}
			value={value}
			onChange={handleChange}
		/>
	)
}
