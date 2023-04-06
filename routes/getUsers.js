const express = require("express");
const router = express.Router();
const findUsers = require("../middlware/findUsers");
//This route assumes we will always be passed a query
router.get("/getuser/:id", findUsers, (req, res) => {
  res.status(200).send({ data: req.users, success: true });
});

module.exports = router;
