import React from 'react'

export interface HeaderProps {
	variant?: 'bottom'
	children?: React.ReactChild
}

export function Header({ variant, children }: HeaderProps) {
	return (
		<h4
			style={{
				color: '#bbbbbb',
				marginBottom: variant == 'bottom' ? '10px' : '0px',
			}}
		>
			{children}
		</h4>
	)
}

export function SubText({ variant, children }: HeaderProps) {
	return (
		<p
			style={{
				color: '#cccccc',
				marginBottom: variant == 'bottom' ? '10px' : '0px',
			}}
		>
			{children}
		</p>
	)
}
