function getRecommendedArtists(user2, matchedGenres, user1TopArtists) {
  const user2TopArtists = user2.user_data.top_artists;
  let recommendedArtists = user2TopArtists.filter((artist) => {
    return (
      !user1TopArtists.has(artist.artist_name) &&
      artist.genres.some((genre) => matchedGenres.includes(genre))
    );
  });
  recommendedArtists = recommendedArtists.slice(
    0,
    Math.min(5, recommendedArtists.length)
  );

  return recommendedArtists.length
    ? recommendedArtists
    : user2TopArtists.slice(0, Math.min(5, user2TopArtists.length));
}
function makeArrayUnique(songArr) {
  let uniqueSongs = new Set();
  let uniqueArr = songArr.filter((song) => {
    if (!uniqueSongs.has(song.artist_name)) {
      uniqueSongs.add(song.artist_name);
      return song;
    }
  });
  return uniqueArr;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getRecommendedSongs(user2, matchedGenres, user1TopSongs) {
  const user2TopSongs = user2.user_data.top_songs;
  let recommendedSongs = user2TopSongs.filter((song) => {
    const recommendedable =
      song.genres.some((genre) => matchedGenres.includes(genre)) &&
      !user1TopSongs.has(`${song.song_name} ${song.artist_name}`);
    return recommendedable;
  });

  let uniqueSongs = makeArrayUnique(recommendedSongs);

  if (uniqueSongs.length >= 5) recommendedSongs = uniqueSongs;

  recommendedSongs = shuffleArray(recommendedSongs).slice(
    0,
    Math.min(5, recommendedSongs.length)
  );

  return recommendedSongs.length
    ? recommendedSongs
    : user2TopSongs.slice(0, Math.min(5, user2TopSongs.length));
}

function getRecommended(user1, user2, matchedGenres) {
  let result = {
    recommended_songs: [],
    recommended_artists: [],
  };
  const user1TopArtists = new Set(
    user1.user_data.top_artists.map((artist) => artist.artist_name)
  );
  const user1TopSongs = new Set(
    user1.user_data.top_songs.map(
      (song) => `${song.song_name} ${song.artist_name}`
    )
  );
  result.recommended_artists = getRecommendedArtists(
    user2,
    matchedGenres,
    user1TopArtists
  );
  result.recommended_songs = getRecommendedSongs(
    user2,
    matchedGenres,
    user1TopSongs
  );

  return result;
}

module.exports = getRecommended;
