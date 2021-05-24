import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		dots: {
			position: 'relative',
			top: '-10px',
			width: '10px',
			height: '10px',
			borderRadius: '5px',
			backgroundColor: theme.palette.primary.main,
			transformOrigin: '5px 15px',
			animation: '$anim 2s infinite linear',
			'&::before, &::after': {
				content: '""',
				display: 'inline-block',
				position: 'absolute',
			},
			'&::before': {
				left: '-8.66px',
				top: '15px',
				width: '10px',
				height: '10px',
				borderRadius: '5px',
				backgroundColor: theme.palette.primary.main,
			},
			'&::after': {
				left: '8.66px',
				top: '15px',
				width: '10px',
				height: '10px',
				borderRadius: '5px',
				backgroundColor: theme.palette.primary.main,
			},
		},
		'@keyframes anim': {
			'0%': {
				transform: 'rotateZ(0deg) translate3d(0, 0, 0)',
			},
			'100%': {
				transform: 'rotateZ(720deg) translate3d(0, 0, 0)',
			},
		},
		stage: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'relative',
			overflow: 'hidden',
			height: '35px',
			width: '35px',
		},
	})
)

export default function Dots() {
	const classes = useStyles()
	return (
		<div className={classes.stage}>
			<div className={classes.dots} />
		</div>
	)
}
