const { User } = require("../models/user");

/**
 * deleteUser - takes an existing user in a database and deletes them from it.
 *
 * @param {*} id - found in request and is used to access user in database.
 *
 */

async function deleteUser(req, res, next) {
  try {
    const id = req.body.vibe_id;
    await User.deleteOne({ "user_info.vibe_id": id });
    next();
  } catch (error) {
    res.status(500).send({ message: "Server error", success: false });
  }
}
module.exports = deleteUser;
