const AgenceManager = require("../managers/AgenceManager");
const ChrismasCalendarManager = require("../managers/ChristmasCalendarManager");
const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
  name: "test",
  use: "**/test**",
  description: "Test.",
  admin: true,
  async execute (client, message, args) {

    if (message.member.roles.cache.find(r => r.name == global.staffRole)) {
      let agence = await AgenceManager.getOneByUserID(message.author.id)
      if(!await ChrismasCalendarManager.getCurrentCalendarDay()){
        ChrismasCalendarManager.startNewCalendarDay();
      }
      if (!await ChrismasCalendarManager.playerAlreadyClaimedReward(message.author.id)) {
        //await ChrismasCalendarManager.addPlayerToPlayersClaimed(message.author.id)

        const rewardInfos = {
          "money": {min: 1, max: 4000},
          "ergol": {min: 1, max: 3000},
          "pds": {min: 1, max: 2000},
          "xp": {min: 1, max: 1000}
        }
        let rewardType = ["money", "ergol", "pds", "xp"]
        let rewardChoosen = rewardType[Math.floor(Math.random() * (rewardType.length -1) + 0)]
        let amount = Math.floor(Math.random() * rewardInfos[rewardChoosen].max + rewardInfos[rewardChoosen].min)
        AgenceManager.claimChristmasReward(agence, rewardChoosen, amount)

        message.channel.send(`won ${rewardChoosen} : ${amount}`)
      }else{
        message.channel.send("Already claimed")
      }
    } else {
      message.channel.send(EmbedMessage.showError(
        client,
        "🛑 Erreur",
        "Vous n'avez pas la permission d'executer cette commande !"
      ))
    }
  }
}