const mongoose = require("mongoose");

const RavitaillementShema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timeToLaunch: Number,
  isActive: {
    "type": Boolean,
    "default": false
  },
  finished: {
    "type": Boolean,
    "default": false
  },
  winnerUsername: {
    "type": String,
    "default": null
  }
});

module.exports = mongoose.model("Ravitaillement", RavitaillementShema);
