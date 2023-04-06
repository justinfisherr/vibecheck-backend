const User = require("../models/user");
async function getUsers(req, res, next) {
  let users = {};
  const parse = {
    user_info: 1,
    _id: 0,
  };
  const conditionals = {
    $or: [
      {
        "user_info.vibe_id": { $regex: `^${req.params.id}`, $options: "i" },
      },
      {
        "user_info.username": {
          $regex: `^${req.params.id}`,
          $options: "i",
        },
      },
    ],
  };
  try {
    users = await User.find(conditionals, parse);
    req.users = users;
    next();
  } catch (error) {
    //We can only reach here on a server error
    res.status(500).send({ message: error, success: false });
  }
}
module.exports = getUsers;
