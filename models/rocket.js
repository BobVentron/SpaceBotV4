const mongoose = require("mongoose");

const RocketSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  userID: String,
  type: String,
  location: String,
  reusable: Boolean,
  successLaunches: {
    "type": Number,
    "default": 0
  },
  image: String,
  payload: {
    "type": String,
    "default": null
  },
  lastLaunch: Number
});

module.exports = mongoose.model("Rockets", RocketSchema);
