import * as util from '../util/url'

export const login = () => {
	const url = util.oauthUrl()
	window.location.href = url
}