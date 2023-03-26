const getTop5Item = require("./getTop5Items");

function topGenres({ user_data }) {
  const myGenres = user_data.top_genres;
  const sortedMap = [...myGenres.entries()].sort((a, b) => b[1].val - a[1].val);
  const justGenres = sortedMap.map((pair) => pair[0]);
  return getTop5Item(justGenres);
}

module.exports = topGenres;
