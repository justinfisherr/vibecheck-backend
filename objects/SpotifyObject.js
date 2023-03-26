const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyObject {
	static instance = null;

	static getSpotifyObject(
		{ redirectUri, clientId, clientSecret } = {
			redirectUri: null,
			clientId: null,
			clientSecret: null,
		}
	) {
		if (!SpotifyObject.instance) {
			SpotifyObject.instance = new SpotifyWebApi({
				redirectUri: redirectUri,
				clientId: clientId,
				clientSecret: clientSecret,
			});
		}
		return SpotifyObject.instance;
	}
}

module.exports = SpotifyObject;
