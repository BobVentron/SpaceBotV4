const Ravitaillement = require("../models/ravitaillement");

class RavitaillementManager {
  static async getCurrentRavitaillement () {
    let result = await Ravitaillement.findOne({ isActive: true, finished: false })
      .then(ravitaillement => { return ravitaillement })
      .catch(err => { console.error(err) })
    return result
  }

  static startRavitaillement () {
    Ravitaillement.findOneAndUpdate({ isActive: false, finished: false }, { isActive: true })
      .catch(err => { console.error(err) })
  }

  static stopRavitaillement (agenceWhichWon) {
    Ravitaillement.findOneAndUpdate({ isActive: true, finished: false }, { finished: true, winnerUsername: agenceWhichWon ? agenceWhichWon.username : "Aucun" })
      .catch(err => { console.error(err) })
  }

  static stopAllRavitaillements () {
    Ravitaillement.updateMany({ finished: false }, { isActive: true, finished: true }).catch(err => { console.error(err) })
  }
}

module.exports = RavitaillementManager