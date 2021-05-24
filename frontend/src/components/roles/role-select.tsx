import {
	makeStyles,
	Theme,
	createStyles,
	Input,
	ListItemText,
	List,
	ListItem,
	Popover,
} from '@material-ui/core'
import React from 'react'
import { Role } from '../../protocol'

import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles<Theme>((theme: Theme) =>
	createStyles({
		roleSelect: {
			width: '300px',
			height: '350px',
			backgroundColor: theme.palette.background.paper,
			borderRadius: '5px',
			overflow: 'hidden',
			boxShadow: '0 3px 15px 4px rgb(0, 0, 0, 20%)',
		},
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
		list: {
			height: 300,
			overflowY: 'auto',
			display: 'flex',
			alignItems: 'center',
			flexFlow: 'column',
		},
		listText: {
			'& span': {
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
		},
	})
)

export interface RoleSelectProps {
	roles: Role[]
	open: boolean
	anchor: HTMLElement | undefined
	onRoleSelect?: (role: Role) => void
	onClose: () => void
}

export default function RoleSelect({
	roles,
	open,
	anchor,
	onRoleSelect,
	onClose,
}: RoleSelectProps) {
	const [displayedRoles, setDisplayedRoles] = React.useState<Role[]>(roles)
	const [currentSearch, setCurrentSearch] = React.useState<string>('')
	const classes = useStyles()

	React.useEffect(() => {
		setDisplayedRoles(roles)
		filterBasedOnSearch(currentSearch)
	}, [roles])

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value
		filterBasedOnSearch(search)
		setCurrentSearch(search)
	}

	const filterBasedOnSearch = (search: string) => {
		search = search.toLowerCase().trim()
		if (search == '') setDisplayedRoles(roles)
		const modified = roles.filter((x) =>
			x.name.toLowerCase().includes(search)
		)
		setDisplayedRoles(modified)
	}

	return (
		<Popover
			id={'role-select'}
			open={open}
			anchorEl={anchor}
			onClose={onClose}
		>
			<div className={classes.roleSelect}>
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
				<List className={classes.list}>
					{displayedRoles.length == 0 ? (
						<p>No roles to display</p>
					) : null}
					{displayedRoles.map((r) => {
						return (
							<ListItem
								button
								onClick={() =>
									onRoleSelect ? onRoleSelect(r) : {}
								}
							>
								<ListItemText
									className={classes.listText}
									style={{
										color: `#${r.color.toString(16)}`,
									}}
								>
									{r.name}
								</ListItemText>
							</ListItem>
						)
					})}
				</List>
			</div>
		</Popover>
	)
}
