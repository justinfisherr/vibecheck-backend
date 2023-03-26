const TopItem = require("../objects/TopItem");

const DEFUALT_STRATA = 10;

function getTop5(fullWeightedArr) {
  let top5Arr = [];

  let i = 0;
  while (i < fullWeightedArr.length && top5Arr.length < 5) {
    top5Arr.push(fullWeightedArr[i]);
    i++;
  }

  return top5Arr;
}

function getLayer(indexOfItem, userStrata) {
  for (let i = 0; i < userStrata.length; ++i) {
    if (indexOfItem < userStrata[i]) {
      return i;
    }
  }
}

function insertionSort(weightedArr) {
  for (let i = 1; i < weightedArr.length; ++i) {
    let j = i - 1;
    while (j >= 0 && weightedArr[j].weight < weightedArr[j + 1].weight) {
      let temp = weightedArr[j + 1];
      weightedArr[j + 1] = weightedArr[j];
      weightedArr[j] = temp;
      j--;
    }
  }
  return weightedArr;
}

function createStrata(length) {
  const strata = Math.ceil(length / DEFUALT_STRATA);

  let layerArr = [];
  for (let i = 1; i <= DEFUALT_STRATA; ++i) {
    layerArr[i - 1] = i * strata;
  }
  return layerArr;
}

function compareItems(topItemInstance) {
  const user1Arr = topItemInstance.getUser1();
  const user2Arr = topItemInstance.getUser2();
  const user1Strata = createStrata(user1Arr.length);
  const user2Strata = createStrata(user2Arr.length);

  let weightedArr = [];
  let addedItem = [];
  for (let i = 0; i < user1Arr.length; ++i) {
    const user2ItemIndex = user2Arr.indexOf(user1Arr[i]);
    const itemFoundInUser2 = user2ItemIndex >= 0;

    if (itemFoundInUser2 && !addedItem.includes(user1Arr[i])) {
      const indexOfItemInUser1Arr = i;
      const indexOfItemInUser2Arr = user2ItemIndex;

      const user1Layer = getLayer(indexOfItemInUser1Arr, user1Strata);
      const user2Layer = getLayer(indexOfItemInUser2Arr, user2Strata);

      const user1Points = DEFUALT_STRATA - user1Layer;
      const user2Points = DEFUALT_STRATA - user2Layer;

      const weight = user1Points + user2Points;
      addedItem.push(user1Arr[i]);
      weightedArr.push(topItemInstance.createObj(i, weight, user1Arr[i]));
    }
  }
  return insertionSort(weightedArr);
}

function getMatches(user1, user2, type) {
  const topItemInstance = new TopItem(user1, user2, type);

  let fullWeightedArr = compareItems(topItemInstance);

  return getTop5(fullWeightedArr);
}

module.exports = getMatches;
