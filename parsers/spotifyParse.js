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

async function getTopSongs(spotifyApi, parsedUser, allGenres) {
  let spotifyArtistIDs = "";

  const topSongs = await spotifyApi.getMyTopTracks({ limit: 50 });
  let filteredSongs = topSongs.body.items.map((song) => {
    let filteredSong = {};
    spotifyArtistIDs += `${song.artists[0].id},`;

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
  spotifyArtistIDs = spotifyArtistIDs.slice(0, -1);

  const songArtists = await spotifyApi.getArtists([spotifyArtistIDs]);

  filteredSongs.map((song, index) => {
    song.genres = songArtists.body.artists[index].genres;
    allGenres.push(songArtists.body.artists[index].genres);
  });

  parsedUser.user_data.top_songs = filteredSongs;
}

async function getTopArtists(spotifyApi, parsedUser, allGenres) {
  const topArtists = await spotifyApi.getMyTopArtists({ limit: 50 });
  const filteredArtists = topArtists.body.items.map((artist) => {
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

async function spotifyParse(spotifyApi) {
  let parsedUser = {
    user_info: {},
    user_data: {},
  };
  let allGenres = [];

  try {
    await getUserInfo(spotifyApi, parsedUser);
    await getTopSongs(spotifyApi, parsedUser, allGenres);
    await getTopArtists(spotifyApi, parsedUser, allGenres);
    getGenres(allGenres, parsedUser);
  } catch (error) {
    throw new Error(`In Spotify Parse: ${error}`);
  }
  return parsedUser;
}
module.exports = spotifyParse;
