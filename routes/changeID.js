const express = require("express");
const router = express.Router();
const validateID = require("../middleware/validateID");
const changeID = require("../middleware/changeID");
const verifyUser = require("../middleware/verifyUser");

router.post("/changeID", validateID, verifyUser, changeID, (req, res) => {
  res.send({ message: "ID changed", success: true, newID: req.body.newID });
});

module.exports = router;
