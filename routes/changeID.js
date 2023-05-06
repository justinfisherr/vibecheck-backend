const express = require("express");
const router = express.Router();
const validateID = require("../middleware/validateID");
const changeID = require("../middleware/changeID");
const verifyUser = require("../middleware/verifyUser");

/**
 * /changeID is a Post Endpoint to change a users vibe_id
 * @middleware validateID - Validates whether new ID is of valid format.
 * @middleware verifyUser - Checks if user exists in the database.
 * @middleware changeID - Changes the users vibe_id in the database.
 *
 * @response If successful, the response will consists of a success message,
 *           success boolean, and the newly changed ID.
 */

router.post("/changeID", validateID, verifyUser, changeID, (req, res) => {
  res.send({ message: "ID changed", success: true, newID: req.body.newID });
});

module.exports = router;
