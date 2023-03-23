const mongoose = require("mongoose");
const AgenceManager = require("../managers/AgenceManager");
const ChrismasCalendarManager = require("../managers/ChristmasCalendarManager");
const EmbedMessage = require("../util/EmbedMessage");
const Rocket = require("../models/rocket");

module.exports = {
  name: "christmas",
  use: "**/christmas**",
  options: [],
  description: "Récupérez quotidiennement du 1er au 25 décembre un cadeau. Surprise le 25 décembre :) ...",
  admin: true,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      const now = new Date();
      if (now.getDate() >= 1 && now.getDate() <= 25 && now.getMonth() == 11) {
        let agence = await AgenceManager.getOneByUserID(message.author.id)
        let newDay = false;
        if (!await ChrismasCalendarManager.getCurrentCalendarDay()) {
          newDay = true;
          return ChrismasCalendarManager.startNewCalendarDay().then(async () => {
            return await this.launchClaim(client, message, agence, now);
          });
        }else{
          return await this.launchClaim(client, message, agence, now);
        }
      } else {
        return EmbedMessage.showError(client, "**Christmas - Erreur**", "Cette commande n'est active que du 1er au 25 Décembre, patience ...")
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  },

  async launchClaim(client, message, agence, now){
    if (agence.lastClaimDay !== now.getDate() && !await ChrismasCalendarManager.playerAlreadyClaimedReward(message.author.id)) {
      await ChrismasCalendarManager.addPlayerToPlayersClaimed(message.author.id)

      const rewardInfos = {
        "money": { min: 1, max: 4000, unit: "€" },
        "ergol": { min: 1, max: 3000, unit: "tonnes d'ergol" },
        "pds": { min: 1, max: 2000, unit: "points de science" },
        "xp": { min: 1, max: 1000, unit: "XP" }
      }
      let rewardType = ["money", "ergol", "pds", "xp"]
      let rewardChoosen = rewardType[Math.floor(Math.random() * (rewardType.length - 1) + 0)]
      let amount = Math.floor(Math.random() * rewardInfos[rewardChoosen].max + rewardInfos[rewardChoosen].min)
      AgenceManager.claimChristmasReward(agence, rewardChoosen, amount)

      let christmasTime = now.getDate() == 25 && now.getMonth() == 11
      if (christmasTime) {
        if (!agence.hasChristmasCalendarLate) {

          const _merged = Object.assign({ _id: mongoose.Types.ObjectId() }, {
            name: "Fusée de Noel",
            userID: message.author.id,
            type: "CHRISTMAS TIME",
            location: "Guyane",
            image: null,
            successLaunches: 0,
            reusable: false,
            payload: "la Tesla du père noël"
          });
          if (_merged.reusable) {
            _merged.lastLaunch = 0
          }
          const rocket = new Rocket(_merged);
          rocket.save();

          return EmbedMessage.showSuccess(client, "**Christmas - Succès**",
            `Aujourd'hui, le père noël vous offre **${amount} ${rewardInfos[rewardChoosen].unit}**, mais ce n'est pas tout ...
              Pour vous récompenser de votre patience jusqu'à ce jour, **vous remportez une fusée de Noël de tiers 2, JOYEUX NOËL 🎄🎊 !**`, message.author)
        } else {
          return EmbedMessage.showSuccess(client, "**Christmas - Succès**",
            `Aujourd'hui, le père noël vous offre **${amount} ${rewardInfos[rewardChoosen].unit}**. Malheureusement vous n'avez pas ouvert votre calendrier chaque jour, vous ne remporterez donc pas de fusée de Noël 😐 **Joyeux noël quand même 🎄🎊 !**`
            , message.author)
        }

      } else {
        return EmbedMessage.showSuccess(client, "**Christmas - Succès**",
          `Aujourd'hui, le père noël vous offre **${amount} ${rewardInfos[rewardChoosen].unit}** ! N'oubliez pas de récupérer quotidiennement votre récompense jusqu'au 25, un gros cadeau vous attend 👀 ...`
          , message.author)
      }
    } else {
      return EmbedMessage.showError(client, "**Christmas - Erreur**", "Vous avez déjà récupéré votre récompense du jour !")
    }
  }
}