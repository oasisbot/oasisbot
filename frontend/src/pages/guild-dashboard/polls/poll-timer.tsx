import React from 'react'

export interface PollTimerProps {
	timestamp: number
}

export default function PollTimer({ timestamp }: PollTimerProps) {
	const [value, setValue] = React.useState(evaluate(timestamp))

	React.useEffect(() => {
		setInterval(() => {
			setValue(evaluate(timestamp))
		}, 1000)
	}, [])

	return <h2>{value}</h2>
}

function evaluate(timestamp: number): string {
	let now = Math.floor(Date.now() / 1000)
	let diff = timestamp - now
	if (diff <= 0) return 'ENDED'

	let d = Math.floor(diff / (3600 * 24))
	let h = Math.floor((diff % (3600 * 24)) / 3600)
	let m = Math.floor((diff % 3600) / 60)
	let s = Math.floor(diff % 60)

	return `${digit(d)}:${digit(h)}:${digit(m)}:${digit(s)}`
}

function digit(num: number): string {
	return num < 10 ? `0${num}` : num.toString()
}
