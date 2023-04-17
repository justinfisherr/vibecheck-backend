const { User } = require("../models/user");

async function changeID(req, res, next) {
  try {
    const oldID = req.body.vibe_id;
    const newID = req.body.newID;

    const currentUser = await User.findOne({ "user_info.vibe_id": oldID });
    const id_not_unique = await User.findOne({ "user_info.vibe_id": newID });

    if (!currentUser)
      res.status(400).send({ message: "User not found", success: false });
    else if (id_not_unique)
      res.status(400).send({ message: "ID taken", success: false });
    else {
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
