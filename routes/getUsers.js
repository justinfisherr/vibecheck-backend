const express = require("express");
const router = express.Router();
const findUsers = require("../middleware/findUsers");
const validateID = require("../middleware/validateID");
const changeID = require("../middleware/changeID");
//This route assumes we will always be passed a query
router.get("/getuser/:id", findUsers, (req, res) => {
  res.send({ data: req.users, success: true });
});

router.post("/changeID", validateID, changeID, (req, res) => {
  res.send({ message: "ID changed", success: true, newID: req.body.newID });
});

module.exports = router;
