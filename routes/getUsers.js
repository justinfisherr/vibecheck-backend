const express = require("express");
const router = express.Router();
const findUsers = require("../middleware/findUsers");
//This route assumes we will always be passed a query
router.get("/getuser/:id", findUsers, (req, res) => {
  res.send({ data: req.users, success: true });
});

module.exports = router;
