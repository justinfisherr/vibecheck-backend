const matchMaker = require("../helpers/matchMaker");
const User = require("../models/user");

async function getMatched(req, res, next) {
  try {
    const userID = req.body.my_username;
    const user2_ID = req.body.other_username;

    const requestedUser = await User.findOne({
      "user_info.vibe_id": user2_ID,
    });

    if (!requestedUser) throw new Error("User doesn't exist");

    //We are safe here as we just registered the Original User
    const originalUser = await User.findOne({
      "user_info.vibe_id": userID,
    });
    const matchedObject = matchMaker(originalUser, requestedUser);
    req.matchedObject = matchedObject;
    next();
  } catch (error) {
    res.status(400).send({ message: error, success: false });
  }
}
module.exports = getMatched;
