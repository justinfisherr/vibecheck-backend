//A helper function that adds a user to our database

const User = require("../models/user");
const spotifyParse = require("../parsers/spotifyParse");

async function addUser() {
  try {
    //Parse the data first
    const parsedData = await spotifyParse();
    const userId = parsedData.user_info.user_id;
    const foundProfile = await User.findOne({
      "user_info.user_id": userId,
    });

    if (foundProfile) {
      parsedData.user_info.vibe_id = foundProfile.user_info.vibe_id;
      await User.findOneAndUpdate(
        {
          "user_info.user_id": userId,
        },
        { $set: parsedData }
      );
    } else {
      const user = new User(parsedData);
      await user.save();
      parsedData.user_info.vibe_id = user.user_info.vibe_id;
    }
    return parsedData.user_info;
  } catch (error) {
    console.log(error, "Found in addUser");
  }
}

module.exports = addUser;
