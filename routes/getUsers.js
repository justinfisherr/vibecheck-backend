const express = require("express");
const router = express.Router();
const User = require("../models/user");

//This route assumes we will always be passed a query
router.get("/getuser/:id", async (req, res) => {
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
    res.status(200).send({ data: users, success: true });
  } catch (error) {
    //We can only reach here on a server error
    res.status(500).send({ message: error, success: false });
  }
});

module.exports = router;
