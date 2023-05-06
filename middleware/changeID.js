const { User } = require("../models/user");

/**
 * changeID - Checks if new vibe_id is already taken then updates the user's
 * vibe_id if available.
 *
 * Found in Request Object
 * @param {String} oldID - old vibe_id is used to find user in database
 * @param {String} newID - this is the verified vibe_id
 * ------------------------------------------------------
 * @param {function} next - function that takes you to next part of response
 *
 */

async function changeID(req, res, next) {
  try {
    const oldID = req.body.vibe_id;
    const newID = req.body.newID;

    const id_not_unique = await User.findOne({ "user_info.vibe_id": newID });

    if (id_not_unique)
      res.status(400).send({ message: "ID taken", success: false });
    else {
      //TODO: Passing username instead of oldID vibe_id to avoid conflicts.
      await User.findOneAndUpdate(
        { "user_info.vibe_id": oldID },
        { "user_info.vibe_id": newID }
      );
      next();
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", success: false });
    console.log(error);
  }
}

module.exports = changeID;
