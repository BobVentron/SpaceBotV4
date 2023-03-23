const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const Agence = require("../models/agence");

class TransactionsManager {

  static async getTransactionsByUserID (userID) {
    let result = await Transaction.find({ userID })
      .then(transactions => { return transactions })
      .catch(err => { console.error(err) })
    return result
  }

  static async addTransaction(userAgence, targetAgence, amount){
    const result = new Transaction();
    result._id = mongoose.Types.ObjectId();
    result.userID = userAgence.userID;
    result.targetID = targetAgence.userID;
    result.amount = amount;
    result.save().then(() => {
      Agence.findOneAndUpdate({ userID: userAgence.userID }, { $inc: { cash: -amount } }, { new: true })
        .then(() => {
          Agence.findOneAndUpdate({ userID: targetAgence.userID }, { $inc: { cash: amount } }, { new: true }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    });
  }
}

module.exports = TransactionsManager;