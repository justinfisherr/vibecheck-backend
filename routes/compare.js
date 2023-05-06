const express = require("express");
const router = express.Router();
const getMatched = require("../middleware/getMatched");
const verifyTwoUsers = require("../middleware/verifyTwoUsers");

/**
 * /compare is a post endpoint that takes two users and returns their
 *  match profile
 *  @middleware verifyTwoUsers - Verifys that both users exist in the database
 *  @middleware getMatched - creates a match profile for both users
 *  @response - If successful, returns the matched profile and a success flag
 */
router.post("/compare", verifyTwoUsers, getMatched, (req, res) => {
  res.status(200).send({ data: req.matchedObject, success: true });
});

module.exports = router;
