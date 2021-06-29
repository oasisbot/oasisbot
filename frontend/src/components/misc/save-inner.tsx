import React from 'react'
import { makeStyles, createStyles, Theme, Button } from '@material-ui/core'

import Dots from './dots'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		saveArea: {
			display: 'flex',
			width: '100%',
			flex: '1',
			flexFlow: 'column-reverse',
			paddingBottom: '20px',
		},
		save: {
			width: '100%',
			height: '80px',
			borderRadius: '5px',
			display: 'flex',
			flexFlow: 'row-reverse',
			alignItems: 'center',
			marginTop: '40px',
			padding: '0 20px',
			backgroundColor: '#161619ff',
		},
		fullSave: {
			position: 'fixed',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			background: 'rgb(0, 0, 0, 40%)',
			zIndex: 10,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}
	})
)

export interface SaveInnerProps {
	onSave: () => void
	onCancel: () => void
	saveText?: string
	variant?: 'full-save'
}

export default function SaveInner({
	onSave,
	onCancel,
	saveText = 'Save',
	variant,
}: SaveInnerProps) {
	const classes = useStyles()
	const [isSaving, setIsSaving] = React.useState(false)

	React.useEffect(() => {
		if (variant == 'full-save') {
			return function cleanup() {
				const body = document.querySelector('body')
				if (body == null) return
				body.style.overflow = ''
			}
		}
	}, [])

	const handleSave = () => {
		setIsSaving(true)
		if (variant == 'full-save') {
			const body = document.querySelector('body')
			if (body == null) return
			body.style.overflow = 'hidden'
		}

		onSave()
	}

	return (
		<div className={classes.saveArea}>
			<div className={classes.save}>
				<Button
					color="inherit"
					style={{ backgroundColor: '#43b581ff' }}
					variant="contained"
					onClick={handleSave}
				>
					{saveText}
				</Button>
				<Button style={{ marginRight: '10px' }} onClick={onCancel}>
					Cancel
				</Button>
			</div>
			{isSaving ? (
				variant == 'full-save' ? (
					<div className={classes.fullSave}>
						<Dots style={{zIndex: 12}}/>
					</div>
				) : undefined
			) : undefined}
		</div>
	)
}
