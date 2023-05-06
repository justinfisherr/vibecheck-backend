const SpotifyObject = require("../objects/SpotifyObject");
const ParseError = require("../errors/errors");

function getGenres(genreArrays, parsedUser) {
  let incrementedGenres = new Map();
  let totalGenres = 0;
  genreArrays.forEach((genreArray) => {
    genreArray.forEach((genre) => {
      genreIncrementer(genre, incrementedGenres);
      totalGenres++;
    });
  });
  parsedUser.user_data.top_genres = incrementedGenres;
  parsedUser.user_data.total_genres = totalGenres;
}

function genreIncrementer(genre, userMap) {
  if (!userMap.has(genre)) userMap.set(genre, { val: 1 });
  else userMap.get(genre).val++;
}

async function getUserInfo(spotifyApi, parsedUser) {
  const userInfo = await spotifyApi.getMe();
  parsedUser.user_info.user_id = userInfo.body.id;
  parsedUser.user_info.username = userInfo.body.display_name;
  if (!userInfo.body.images[0]) {
    parsedUser.user_info.profile_img = "";
  } else {
    parsedUser.user_info.profile_img = userInfo.body.images[0].url;
  }
}

async function getTopSongsNoDupes(spotifyApi) {
  const shortTerm = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: "short_term",
  });

  const longTerm = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: "long_term",
  });
  let result = shortTerm.body.items;
  result.push(...longTerm.body.items);

  let addedSongs = new Set();
  return result.filter((song) => {
    const isDuplicate = addedSongs.has(song.name);
    if (!isDuplicate) addedSongs.add(song.name);
    return !isDuplicate;
  });
}

async function parseTopSongs(spotifyApi, parsedUser, allGenres) {
  const topSongs = await getTopSongsNoDupes(spotifyApi);

  let filteredSongs = topSongs.map((song) => {
    let filteredSong = {};
    filteredSong.song_name = song.name;
    filteredSong.artist_name = song.artists[0].name;
    filteredSong.url = song.external_urls.spotify;
    filteredSong.preview_url = song.preview_url;

    if (!song.album.images[0]) {
      filteredSong.song_img = "";
    } else {
      filteredSong.song_img = song.album.images[0].url;
    }
    return filteredSong;
  });

  parsedUser.user_data.top_songs = filteredSongs;
}

async function getTopArtistsNoDupes(spotifyApi) {
  const shortTerm = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: "short_term",
  });

  const longTerm = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: "long_term",
  });
  let result = shortTerm.body.items;
  result.push(...longTerm.body.items);

  let addedArtists = new Set();
  return result.filter((artist) => {
    const isDuplicate = addedArtists.has(artist.name);
    if (!isDuplicate) addedArtists.add(artist.name);
    return !isDuplicate;
  });
}
async function parseTopArtist(spotifyApi, parsedUser, allGenres) {
  const topArtists = await getTopArtistsNoDupes(spotifyApi);
  const filteredArtists = topArtists.map((artist) => {
    const filteredArtist = {};
    filteredArtist.artist_name = artist.name;

    if (!artist.images[0]) {
      filteredArtist.artist_img = "";
    } else {
      filteredArtist.artist_img = artist.images[0].url;
    }
    allGenres.push(artist.genres);
    filteredArtist.genres = artist.genres;
    return filteredArtist;
  });

  parsedUser.user_data.top_artists = filteredArtists;
}

async function spotifyParse() {
  const spotifyApi = SpotifyObject.getSpotifyObject();
  let parsedUser = {
    user_info: {},
    user_data: {},
  };
  let allGenres = [];

  try {
    await getUserInfo(spotifyApi, parsedUser);
    await parseTopSongs(spotifyApi, parsedUser, allGenres);
    await parseTopArtist(spotifyApi, parsedUser, allGenres);
    getGenres(allGenres, parsedUser);
  } catch (error) {
    console.log("Error Parsing through Spotify Object: ", error);
    throw new ParseError(error);
  }
  return parsedUser;
}
module.exports = spotifyParse;
