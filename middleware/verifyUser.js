const { User } = require("../models/user");

/**
 * verifyUser - checks if a single user exists in our database. This will be
 * used for functions like deleting or changing a user to ensure the user
 * exists.
 *
 * @param {string} id - a user's vibe_ID.
 *
 */

async function verifyUser(req, res, next) {
  const id = req.body.vibe_id;
  try {
    const currentUser = await User.findOne({ "user_info.vibe_id": id });
    if (currentUser) next();
    else res.status(400).send({ message: "User not found", success: false });
  } catch (err) {
    res.status(500).send({ message: "Server error", success: false });
  }
}
module.exports = verifyUser;
