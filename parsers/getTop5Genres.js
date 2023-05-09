const getTop5Item = require("./getTop5Items");

/**
 * topGenres - finds the top genres of a user. Since this was implemented with a map there
 * was extended map logic like sorting and extracting keys.
 *
 * @param {object} user_data - userbase user's data
 * @returns - array of genre stringsin descending order by frequency.
 */

function topGenres({ user_data }) {
  const myGenres = user_data.top_genres;
  const sortedMap = [...myGenres.entries()].sort((a, b) => b[1].val - a[1].val);
  const justGenres = sortedMap.map((pair) => pair[0]);
  return getTop5Item(justGenres);
}

module.exports = topGenres;
