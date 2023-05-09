/**
 * getTop5 - takes any array and gives you the top 5 if there is 5 if not will
 * return the array itself
 */
function getTop5(itemArray) {
  if (itemArray.length > 5) {
    return itemArray.slice(0, 5);
  }
  return itemArray;
}

module.exports = getTop5;
