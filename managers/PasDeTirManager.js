const PasDeTir = require("../models/pasdetir");

class PasDeTirManager {
  static async pdtExists (userID, pdtName) {
    let result = await PasDeTir.exists({ userID, name: pdtName })
      .then(bool => { return bool })
      .catch(err => { console.error(err) })
    return result
  }

  static async getPdtByUserID (userID) {
    let result = await PasDeTir.find({ userID })
      .then(items => { return items })
      .catch(err => { console.error(err) })
    return result
  }

  static async hasPdtInLocation (userID, location) {
    let result = await PasDeTir.find({ userID, location })
      .then(items => { return items.length > 0 })
      .catch(err => { console.error(err) })
    return result
  }

  static async getPdtByUserIdAndRocket (userID, rocket) {
    let result = await PasDeTir.findOne({ userID, rocketID: rocket._id })
      .then(items => { return items })
      .catch(err => { console.error(err) })
    return result
  }

  static async getPdtByUserIdAndName (userID, name) {
    let result = await PasDeTir.findOne({ userID, name })
      .then(pdt => { return pdt })
      .catch(err => { console.error(err) })
    return result
  }

  static async getPdtByUserIdAndLocation (userID, location) {
    let result = await PasDeTir.find({ userID, location })
      .then(items => { return items })
      .catch(err => { console.error(err) })
    return result
  }

  static linkRocketToPdt (userID, pdt, rocket) {
    PasDeTir.findOneAndUpdate({ userID, name: pdt.name }, { available: false, rocketID: new String(rocket._id) })
      .catch(err => { console.error(err) })
  }

  static unlinkRocketToPdt (userID, pdt) {
    PasDeTir.findOneAndUpdate({ userID, name: pdt.name }, { available: true, rocketID: null })
      .catch(err => { console.error(err) })
  }

  static updatePdtName (userID, oldName, newName) {
    PasDeTir.findOneAndUpdate({ userID, name: oldName }, { name: newName })
      .catch(err => { console.error(err) })
  }
}

module.exports = PasDeTirManager