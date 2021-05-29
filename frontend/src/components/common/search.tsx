import React from 'react'
import { Input, makeStyles, createStyles, Theme } from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles<Theme>((theme: Theme) =>
	createStyles({
        search: {
			width: '100%',
			height: '50px',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			flexFlow: 'row',
			boxShadow: '0 3px 10px 2px rgb(0, 0, 0, 20%)',
		},
		searchLeft: {
			height: '100%',
			width: '50px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		searchRight: {
			height: '100%',
			flex: '1',
			display: 'flex',
			alignItems: 'center',
			paddingRight: '20px',
		},
        input: {
			width: '100%',
		},
    })
)

export interface SearchProps {
	handleSearch: (search: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Search({ handleSearch }: SearchProps) {
    const classes = useStyles()

	return (
		<div className={classes.search}>
			<div className={classes.searchLeft}>
				<SearchIcon />
			</div>
			<div className={classes.searchRight}>
				<Input
					className={classes.input}
					color="secondary"
					placeholder="Search"
					onChange={handleSearch}
				/>
			</div>
		</div>
	)
}
