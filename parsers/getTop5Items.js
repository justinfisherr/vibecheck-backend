function getTop5(itemArray) {
  if (itemArray.length > 5) {
    return itemArray.slice(0, 5);
  }
  return itemArray;
}

module.exports = getTop5;
