const mongoose = require("mongoose");

const Counter = mongoose.Schema({
  count: Number,
});

module.exports = mongoose.model("counters", Counter);
