const { User } = require("../models/user");

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
