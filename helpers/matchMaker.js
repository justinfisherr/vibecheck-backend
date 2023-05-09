const getMatches = require("../algos/getMatches");
const getCompatibility = require("../algos/getCompatibility");
const getTop5Items = require("../parsers/getTop5Items");
const getTop5Genres = require("../parsers/getTop5Genres");
const getRecommended = require("../algos/getRecommended");
/**
 * matchMaker - takes two Spotify User's and compares their data against
 * eachother to create a match profile consiting of matching songs, artists
 * genres, and recommendations.
 *
 * @param {object} user1 - end user's Spotify Data.
 * @param {object} user2 - requested user's Spotify Data.
 *
 * @returns {object} - An object containing two user's match profile.
 */

function matchMaker(user1, user2) {
  const user1TopGenres = getTop5Genres(user1);
  const user2TopGenres = getTop5Genres(user2);

  const matchedArtists = getMatches(user1, user2, "Artist");
  const matchedSongs = getMatches(user1, user2, "Song");

  const matchedGenres = getMatches(user1, user2, "Genre").map(
    (genreObj) => genreObj.genre
  );

  const recommendedItems = getRecommended(user1, user2, matchedGenres);
  const compatibility = getCompatibility(user1, user2);
  const matchProfile = createMatchProfile(
    user1,
    user2,
    user1TopGenres,
    user2TopGenres,
    recommendedItems,
    matchedGenres,
    matchedArtists,
    matchedSongs,
    compatibility
  );
  return matchProfile;
}

/**
 * createMatchProfile - takes all the user's match data and creates a nicely
 * formatted object for the client to read.
 *
 * @returns - Object of user's match data.
 */

function createMatchProfile(
  user1,
  user2,
  user1TopGenres,
  user2TopGenres,
  recommendedItems,
  matchedGenres,
  matchedArtists,
  matchedSongs,
  compatibility
) {
  return {
    users: {
      user1: {
        profile_img: user1.user_info.profile_img,
        username: user1.user_info.username,
        id: user1.user_info.user_id,
        vibe_id: user1.user_info.vibe_id,
        top_genres: user1TopGenres,
        top_artists: getTop5Items(user1.user_data.top_artists),
        top_songs: getTop5Items(user1.user_data.top_songs),
      },
      user2: {
        profile_img: user2.user_info.profile_img,
        username: user2.user_info.username,
        id: user2.user_info.user_id,
        vibe_id: user2.user_info.vibe_id,
        top_genres: user2TopGenres,
        top_artists: getTop5Items(user2.user_data.top_artists),
        top_songs: getTop5Items(user2.user_data.top_songs),
        recommended_artists: recommendedItems.recommended_artists,
        recommended_songs: recommendedItems.recommended_songs,
      },
    },
    match_profile: {
      matching_genres: matchedGenres,
      matching_artists: matchedArtists,
      matching_songs: matchedSongs,
      match_percent: compatibility,
    },
  };
}

module.exports = matchMaker;
