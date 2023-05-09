const { User } = require("../models/user");
const spotifyParse = require("../parsers/spotifyParse");
const { createVibeID } = require("../models/user");

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
      //If there exists a user with the vibe_id of the current user's userID
      //usernameTaken will be truthy.
      const usernameTaken = await User.findOne({
        "user_info.vibe_id": userId,
      });

      //If username is taken we create a new vibe_id.
      if (usernameTaken) parsedData.user_info.vibe_id = await createVibeID();

      const user = new User(parsedData);

      //save will trigger the presave middleware in /models/user
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
