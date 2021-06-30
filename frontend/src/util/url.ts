import { appClientID, baseURL } from '../lib/constants'

export function isOnAccessPage(): boolean {
	const url = window.location.pathname
	if (url === '/dashboard') return true
	if (url.startsWith('/d/')) return true
	return false
}

export function oauthUrl(): string {
	const base = 'https://discord.com/api/oauth2/authorize'
	const clientID = `?client_id=${appClientID}`
	const red = `&redirect_uri=${encodeURIComponent(baseURL)}%2Fauth%2Fcallback`
    const scopes = `&response_type=code&scope=identify%20email%20guilds`
    return base + clientID + scopes + red + scopes
}
