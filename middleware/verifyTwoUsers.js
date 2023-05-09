const { User } = require("../models/user");

/**
 * verifyTwoUsers - takes two Spotify Usernames from two respective users
 * and checks if they exist in the database. They will then be appended to
 * the request object and safely accessed outside of this function.
 *
 * @param {string} userID - end user's Spotify Username (safe).
 * @param {string} user2_ID - requested user's Spotify Username.
 *
 */

async function verifyTwoUsers(req, res, next) {
  try {
    const userID = req.body.my_username;
    const user2_ID = req.body.other_username;

    const requestedUser = await User.findOne({
      "user_info.vibe_id": user2_ID,
    });

    if (!requestedUser) throw new Error("Requested User doesn't exist");

    const originalUser = await User.findOne({
      "user_info.vibe_id": userID,
    });
    if (!originalUser) throw new Error("Original User doesn't exist");
    req.requestedUser = requestedUser;
    req.originalUser = originalUser;
    next();
  } catch (error) {
    res.status(400).send({ message: error, success: false });
  }
}

module.exports = verifyTwoUsers;
