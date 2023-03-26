//A helper function that adds a user to our database

const User = require("../models/user");
const Counter = require("../models/counter");
const spotifyParse = require("../parsers/spotifyParse");

async function addUser() {
  try {
    //Parse the data first
    const parsedData = await spotifyParse();
    const foundProfile = await User.findOne({
      "user_info.user_id": parsedData.user_info.user_id,
    });
    if (foundProfile) {
      let user = await User.findOne({
        "user_info.user_id": parsedData.user_info.user_id,
      });
      parsedData.user_info.vibe_id = user.user_info.vibe_id;

      await User.findOneAndUpdate(
        {
          "user_info.user_id": parsedData.user_info.user_id,
        },
        { $set: parsedData }
      );
    } else {
      if (parsedData.user_info.user_id.length > 15) {
        const { count } = await Counter.findOneAndUpdate(
          {},
          { $inc: { count: 1 } }
        );
        const vibeId = "v" + count.toString().padStart(7, 0);
        parsedData.user_info.vibe_id = vibeId;
      } else {
        parsedData.user_info.vibe_id = parsedData.user_info.user_id;
      }

      const user = new User(parsedData);
      await user.save();
    }
    return parsedData.user_info;
  } catch (error) {
    console.log(error, "Found in addUser");
  }
}

module.exports = addUser;
