import React from 'react'

export interface SecondsTimestampProps {
	timestamp: number
	style?: React.CSSProperties | undefined
	preText?: string
	postText?: string
	zeroText?: string
}
interface SecondsTimestampState {
	timer: NodeJS.Timeout
	seconds: number
}

export class SecondsTimestamp extends React.Component<
	SecondsTimestampProps,
	SecondsTimestampState
> {
	constructor(props: SecondsTimestampProps) {
		super(props)
	}

	componentWillMount() {
		this.setState({
			timer: setInterval(
				() => this.setState({ seconds: this.evaluate() }),
				1000
			),
		})
		this.setState({ seconds: this.evaluate() })
	}

	evaluate(): number {
		let now = Math.floor(Date.now() / 1000)
		let then = this.props.timestamp
		let value = then - now
		if (value <= 0 && this.state) clearInterval(this.state.timer)

		return value
	}

	render() {
		let pre = this.props.preText
		let secs = this.state.seconds
		let post = this.props.postText
		return (
			<h3 style={this.props.style}>
				{this.state.seconds > 0 || !this.props.zeroText
					? `${pre || ''}${secs}${post || ''}`
					: `${this.props.zeroText}`}
			</h3>
		)
	}
}
