const Rocket = require("../models/rocket");

class RocketManager {
  static async rocketExists (userID, rocketName) {
    let result = await Rocket.exists({ userID, name: rocketName })
      .then(bool => { return bool })
      .catch(err => { console.error(err) })
    return result
  }

  static async getRocketsByUserID (userID) {
    let result = await Rocket.find({ userID })
      .then(rockets => { return rockets })
      .catch(err => { console.error(err) })
    return result
  }

  static async getRocketByUserIDAndName (userID, name) {
    let result = await Rocket.findOne({ userID, name })
      .then(rocket => { return rocket })
      .catch(err => { console.error(err) })
    return result
  }

  static async deleteRocket (userID, name) {
    await Rocket.findOneAndDelete({ userID, name })
      .catch(err => { console.error(err) })
  }

  static updateRocketPayload (userID, rocketName, rocketPayload) {
    Rocket.findOneAndUpdate({ userID, name: rocketName }, { payload: rocketPayload })
      .catch(err => { console.error(err) })
  }

  static updateRocketName (userID, oldName, newName) {
    Rocket.findOneAndUpdate({ userID, name: oldName }, { name: newName })
      .catch(err => { console.error(err) })
  }

  static updateRocketImage (userID, rocketName, imageLink) {
    Rocket.findOneAndUpdate({ userID, name: rocketName }, { image: imageLink })
      .catch(err => { console.error(err) })
  }

  static updateRocketSuccessLaunches (userID, rocketName, counter) {
    Rocket.findOneAndUpdate({ userID, name: rocketName }, { successLaunches: counter })
      .catch(err => { console.error(err) })
  }

  static updateRocketReusableLastLaunch (userID, rocketName, time) {
    Rocket.findOneAndUpdate({ userID, name: rocketName }, { lastLaunch: time })
      .catch(err => { console.error(err) })
  }
}

module.exports = RocketManager