const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  targetID: String,
  amount: Number
});

module.exports = mongoose.model("Transactions", TransactionSchema);
