import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

import { BrowserRouter } from 'react-router-dom'

import {
	createMuiTheme,
	ThemeProvider,
	responsiveFontSizes,
	CssBaseline,
} from '@material-ui/core'

const useTheme = () => {
	return responsiveFontSizes(
		createMuiTheme({
			palette: {
				type: 'dark',
				background: {
					default: '#202126',
					paper: '#393a41ff',
				},
				primary: { main: '#fb3640' },
				secondary: { main: '#4cc9f0' },
			},
		})
	)
}

const Root = () => {
	const theme = useTheme()
	return (
		<React.StrictMode>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<App />
				</ThemeProvider>
			</BrowserRouter>
		</React.StrictMode>
	)
}

ReactDOM.render(<Root />, document.getElementById('root'))
