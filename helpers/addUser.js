const { User } = require("../models/user");
const spotifyParse = require("../parsers/spotifyParse");

/**
 * addUser - Creates or updates a Vibe Check user by parsing
 * Spotify Data using the spotifyParse function.
 *
 * note: Logic gets murky so follow line level comments.
 *
 * @param {object} spotifyApi - An object that carries functions and calls to
 * the Spotify API.
 *
 *
 * @returns - The user's Spotify Account info for instant access.
 */

async function addUser(spotifyApi) {
  try {
    const parsedData = await spotifyParse(spotifyApi);

    const userId = parsedData.user_info.user_id;

    const foundProfile = await User.findOne({
      "user_info.user_id": userId,
    });
    //If user exists in database, update that user's spotify information.
    if (foundProfile) {
      parsedData.user_info.vibe_id = foundProfile.user_info.vibe_id;
      await User.findOneAndUpdate(
        {
          "user_info.user_id": userId,
        },
        { $set: parsedData }
      );
    } // Else statement catches new users.
    else {
      //see middleware /models/user to find the logic for vibe_id creation
      const user = new User(parsedData);
      await user.save();
      parsedData.user_info.vibe_id = user.user_info.vibe_id;
    }

    return parsedData.user_info;
  } catch (error) {
    console.log(error, "Found in addUser");
    throw error;
  }
}

module.exports = addUser;
