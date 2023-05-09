const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const deleteUser = require("../middleware/deleteUser");
/**
 * /deleteUser is a delete endpoint that deletes a user in the database
 * @middleware verifyUser - verifys if the user exists in the database
 * @middleware deleteUser - deletes the user
 * @response - If successful, a success flag is sent.
 */
router.delete("/deleteUser", verifyUser, deleteUser, (req, res) => {
  res.send({ message: "User deleted", success: true });
});

module.exports = router;
