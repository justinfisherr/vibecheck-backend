//A helper function that figure out two user's match data
const getMatches = require("../algos/getMatches");
const getCompatibility = require("../algos/getCompatibility");
const getTop5Items = require("../parsers/getTop5Items");
const getTop5Genres = require("../parsers/getTop5Genres");
const getRecommended = require("../algos/getRecommended");

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
  const responseObject = {
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
  return responseObject;
}
module.exports = matchMaker;
