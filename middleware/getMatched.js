const matchMaker = require("../helpers/matchMaker");

/**
 * getMatched - takes two users and calls the 'matchMaker' function to get
 * the two user's match profile.
 *
 * @param originalUser - the end user's Spotify Api Data
 * @param requestedUser - the requested user's Spotify Api Data.
 *
 */

async function getMatched(req, res, next) {
  try {
    const { originalUser, requestedUser } = req;
    const matchedObject = matchMaker(originalUser, requestedUser);
    req.matchedObject = matchedObject;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error, success: false });
  }
}
module.exports = getMatched;
