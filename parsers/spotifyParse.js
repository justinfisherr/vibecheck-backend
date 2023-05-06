const ParseError = require("../errors/errors");

/**
 * genreIncrementer - Checks if genre exists in map and updates frequency based on that logic.
 * @param {string} genre - a genre from the genres array
 * @param {map} userMap - a map of genres as keys and frequncies of that genre as values
 */

function genreIncrementer(genre, userMap) {
  if (!userMap.has(genre)) userMap.set(genre, { val: 1 });
  else userMap.get(genre).val++;
}
/**
 * getGenres - takes all collected genres, counts duplicates, and creates a map with
 * genres as keys and the frequency of genre as the value. This is then appended to
 * the parsedUser as his top_genres.
 *
 * @param {array} genreArrays - an array of arrays filled with genres
 * @param {Object} parsedUser - an object that will be filled with Spotify Data
 *
 */
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

/**
 * getUserInfo - makes a call to the Spotify Api to grab the user's profile information.
 *
 * @param {Object} spotifyApi - spotifyApi is an object to access Spotify's API
 * @param {Object} parsedUser - an object that will be filled with Spotify Data
 *
 */
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
/**
 * getTopSongsNoDupes - this function does the actual calls to the Spotify API.
 * It uses two time periods, short_term and long_term to gain access to two objects filled with
 * songs.
 * The shortTerm and longTerm arrays are connected together.
 * Before returning, the connected array is filtered for duplicates.
 *
 * @param {Object} spotifyApi - spotifyApi is an object to access Spotify's API
 * @returns - An array of Spotify Song objects with no Duplicates
 */

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
/**
 * parseTopSongs - makes a request to the Spotify API to grab all topSongs.
 * The songs are then filtered into an array containing the important information
 * about the song.
 * This filtered array is then added to the parsedUser object
 *
 * @param {Object} spotifyApi - spotifyApi is an object to access Spotify's API
 * @param {Object} parsedUser - an object that will be filled with Spotify Data

 */
async function parseTopSongs(spotifyApi, parsedUser) {
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
/**
 * getTopArtistsNoDupes - this function does the actual calls to the Spotify API.
 * It uses two time periods, short_term and long_term to gain access to two objects filled with
 * artists.
 * The shortTerm and longTerm arrays are connected together.
 * Before returning, the connected array is filtered for duplicates.
 *
 * @param {Object} spotifyApi - spotifyApi is an object to access Spotify's API
 * @returns - An array of Spotify Artist objects with no Duplicates
 */

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
/**
 * parseTopArtists - makes a request to the Spotify API to grab all topArtists.
 * The artists are then filtered into an array containing the important information
 * about the artist.
 * All genre information about artist is pushed into allGenres array.
 * This filtered array is then added to the parsedUser object
 *
 * @param {Object} spotifyApi - spotifyApi is an object to access Spotify's API
 * @param {Object} parsedUser - an object that will be filled with Spotify Data
 * @param {Array} allGenres - an array of Genres.
 */

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

/**
 * spotifyParse - Makes calls to Spotify's API to gather data about user. It then parses this
 * data and extracts only the neccessary information for the app. spotifyParse parses
 * the users info, top songs, and artists. 4 total calls are made to the Spotify API.
 *
 * @param {Object} spotifyApi - spotifyApi is an object to access Spotify's API
 *
 * @returns {Object} parsedUser - an object of all the parsed data mentioned above.
 *
 */
async function spotifyParse(spotifyApi) {
  let parsedUser = {
    user_info: {},
    user_data: {},
  };
  let allGenres = [];

  try {
    await getUserInfo(spotifyApi, parsedUser);
    await parseTopSongs(spotifyApi, parsedUser);
    await parseTopArtist(spotifyApi, parsedUser, allGenres);
    getGenres(allGenres, parsedUser);
  } catch (error) {
    console.log("Error Parsing through Spotify Object: ", error);
    throw new ParseError(error);
  }
  return parsedUser;
}
module.exports = spotifyParse;
