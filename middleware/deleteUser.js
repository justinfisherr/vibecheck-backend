const { User } = require("../models/user");

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
