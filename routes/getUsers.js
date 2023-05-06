const express = require("express");
const router = express.Router();
const findUsers = require("../middleware/findUsers");

/**
 * /getuser is a get endpoint that grabs users by query
 * @param id - This url paramater will be leveraged to query the database.
 *             Can come in the form of: username, vibe_id, name.
 * @middleware findUsers - queries the database based off of the id param.
 * @response - if users who match that query are found, return an array of
 *             users.
 */

router.get("/getuser/:id", findUsers, (req, res) => {
  res.send({ data: req.users, success: true });
});

module.exports = router;
