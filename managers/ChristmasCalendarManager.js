const mongoose = require("mongoose");
const ChristmasCalendarSchema = require("../models/christmasCalendar");

class ChristmasCalendarManager {
  static async getCurrentCalendarDay () {
    const now = new Date();
    let result = await ChristmasCalendarSchema.findOne({ day: now.getDate(), finished: false })
      .then(ravitaillement => { return ravitaillement })
      .catch(err => { console.error(err) })
    return result
  }

  static stopOldCalendarDay(day) {
    ChristmasCalendarSchema.findOneAndUpdate({ day: day, finished: false }, { finished: true })
      .catch(err => { console.error(err) })
  }

  static async startNewCalendarDay(){
    //ChristmasCalendarManager.stopOldCalendarDay(new Date().getDate());
    ChristmasCalendarManager.stopOldCalendarDay(new Date().getDate() -1);
    let result = new ChristmasCalendarSchema()
    result._id = mongoose.Types.ObjectId()
    result.save()
  }

  static async playerAlreadyClaimedReward(userID){
    return ChristmasCalendarManager.getCurrentCalendarDay().then(currentCalendarDay => {
      console.log(currentCalendarDay)
      if(currentCalendarDay){
        return currentCalendarDay.playersClaimed.filter(p => p === userID).length > 0;
      }
    }).catch(err => console.error(err));
  }

  static async addPlayerToPlayersClaimed(userID){
    ChristmasCalendarManager.getCurrentCalendarDay().then(currentCalendarDay => {
      currentCalendarDay.playersClaimed.push(userID);
      if (currentCalendarDay) {
        ChristmasCalendarSchema.findByIdAndUpdate(currentCalendarDay._id, { playersClaimed: currentCalendarDay.playersClaimed })
          .catch(err => { console.error(err) })
      }
    }).catch(err => console.error(err));
  }
}

module.exports = ChristmasCalendarManager