/*
  Two routes that handle all Spotify Authorization requests and responds
  with a working Spotify API object. 
*/

const express = require("express");
const router = express.Router();
const SpotifyObject = require("../objects/SpotifyObject");
const addUser = require("../helpers/addUser");
const SpotifyWebApi = require("spotify-web-api-node");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const redirect_url =
  process.env.NODE_ENV === "production"
    ? "https://vibecheck-backend-production.up.railway.app"
    : "http://localhost:5000";

const home_url =
  process.env.NODE_ENV === "production"
    ? "https://thevibecheck.io"
    : "http://localhost:3000";

const redirect_uri = `${redirect_url}/callback`;

const scopes = ["user-top-read"];

const Global_Spotify_Api = SpotifyObject.getSpotifyObject({
  redirectUri: redirect_uri,
  clientId: client_id,
  clientSecret: client_secret,
});

/** 
  Endpoint /login
  Redirects user to Spotify's Authorization page.
*/

router.get("/login", (req, res) => {
  res.redirect(
    Global_Spotify_Api.createAuthorizeURL(scopes, "authorizing", true)
  );
});

/** 
  Endpoint /callback
  After authorizing, this endpoint is hit automatically from Spotify.
  If successful, The Spotify API is now accessible. 
  If not, the end-user is redirected to the home page. 
*/

router.get("/callback", async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    console.error("Callback Error:", error);
    res.redirect(home_url);
    return;
  }

  try {
    const spotifyApi = new SpotifyWebApi({
      redirectUri: redirect_uri,
      clientId: client_id,
      clientSecret: client_secret,
    });
    const data = await spotifyApi.authorizationCodeGrant(code);

    const access_token = data.body["access_token"];
    const refresh_token = data.body["refresh_token"];
    const expires_in = data.body["expires_in"];

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    //Adds user to database
    const { username, profile_img, vibe_id } = await addUser(spotifyApi);

    // Redirect user
    const url =
      process.env.NODE_ENV === "production"
        ? "https://thevibecheck.io/compare"
        : "http://localhost:3000/compare";

    const urlObj = new URL(url);
    urlObj.search = new URLSearchParams({
      token: access_token,
      refresh_token: refresh_token,
      username: username,
      vibe_id: vibe_id,
      profile_img: profile_img,
    });
    res.redirect(urlObj.toString());
  } catch (err) {
    console.error("Error getting Tokens:", err);
    res.redirect(home_url + "?error=true");
  }
});
module.exports = router;
