const mongoose = require("mongoose");

const ChristmasCalendar = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  day: {
    "type": Number,
    "default": new Date().getDate()
  },
  finished: {
    "type": Boolean,
    "default": false
  },
  playersClaimed: {
    "type": Array,
    "default": []
  }
});

module.exports = mongoose.model("ChristmasCalendar", ChristmasCalendar);
