const express = require("express");
const router = express.Router();
const getMatched = require("../middleware/getMatched");

router.post("/compare", getMatched, (req, res) => {
  res.status(200).send({ data: req.matchedObject, success: true });
});

module.exports = router;
