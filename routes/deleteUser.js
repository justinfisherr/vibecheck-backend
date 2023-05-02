const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const deleteUser = require("../middleware/deleteUser");
router.delete("/deleteUser/", verifyUser, deleteUser, (req, res) => {
  res.send({ message: "User deleted", success: true });
});

module.exports = router;
