const mongoose = require("mongoose");
const Ravitaillement = require("../models/ravitaillement");
const RavitaillementManager = require("../managers/RavitaillementManager");
const EmbedMessage = require("./EmbedMessage");

module.exports = {
  initializeEvent (client) {
    new Promise(function (resolve, reject) {
      resolve(RavitaillementManager.getCurrentRavitaillement())
    }).then((ravitaillement) => {
      if (ravitaillement == null) {
        let date = new Date()
        let oldDateTime = new Date()
        const maxDays = 6, maxHours = 23, maxMinutes = 59
        date.setDate(date.getDate() + Math.floor(Math.random() * maxDays + 1)) // Entre 1 et 6 jours en plus
        date.setHours(date.getHours() + Math.floor(Math.random() * maxHours + 1)) // Entre 1 et 23h en plus
        date.setMinutes(date.getMinutes() + Math.floor(Math.random() * maxMinutes + 1)) // Entre 1 et 59 minutes en plus
        console.log("Ravitaillement le : " + date);
        let ravitaillement = new Ravitaillement()
        ravitaillement._id = mongoose.Types.ObjectId()
        ravitaillement.timeToLaunch = date.getTime()
        ravitaillement.save()
        setTimeout(() => {
          this.launchEvent(client)
        }, date.getTime() - oldDateTime.getTime())
      } else {
        this.launchEvent(client)
      }
    })
  },

  launchEvent (bot) {
    console.log("coucou");
    new Promise(function (resolve, reject) {
      resolve(RavitaillementManager.getCurrentRavitaillement())
    }).then((ravitaillement) => {
      if (ravitaillement == null) {
        let channel = bot.channels.cache.find(ch => ch.id === bot.SERVER_INFOS.channelId);
        channel.send({
          embeds: [new EmbedMessage(bot, {
            title: "**Alerte - Ravitaillement**",
            description: "Le ravitaillement a commencé ! Votre mission, si toutefois vous l'acceptez, sera d'envoyer une fusée vers l'ISS " +
              "avec une charge utile pour ravitailler nos courageaux astronautes. Envoyez une fusée le premier pour remporter la récompense." +
              "**Vous ne disposez que d\'une heure**. Passé ce délai, vous devrez attendre le prochain appel.",
            thumbnail: true,
            color: '#f0e407'
          })]
        });
        RavitaillementManager.startRavitaillement()
      }
      setTimeout(() => {
        this.checkRavitaillementState(bot);
      }, 3600000)
    })
  },

  checkRavitaillementState(bot, data) {

    new Promise(function (resolve, reject) {
      resolve(RavitaillementManager.getCurrentRavitaillement())
    }).then((ravitaillement) => {
      if (ravitaillement != null) {
        let channel = bot.channels.cache.find(ch => ch.id === bot.SERVER_INFOS.channelId);
        if (data != undefined) {
          RavitaillementManager.stopRavitaillement(data.agence)
          channel.send({
            embeds: [new EmbedMessage(bot, {
              title: "**Alerte - Ravitaillement**",
              description: `Le ravitaillement est terminé ! L'agence **${data.agence.agenceName}** a su saisir sa chance et remporte **${Math.round(data.reward)} XP** ! 
                          Un autre ravitaillement sera nécessaire dans la semaine, tenez vous prêt(e) !`,
              thumbnail: true,
              color: '#f0e407'
            })]
          })
        } else {
          RavitaillementManager.stopRavitaillement()
          channel.send({
            embeds: [new EmbedMessage(bot, {
              title: "**Alerte - Ravitaillement**",
              description: "Le ravitaillement est terminé ! Personne n'a lancé de fusée pour ravitailler l'ISS. " +
                "Un autre ravitaillement sera nécessaire dans la semaine, tenez vous prêt(e) !",
              thumbnail: true,
              color: '#f0e407'
            })]
          })
        }
      }
      setTimeout(() => {
        this.initializeEvent(bot)
      }, 10000)
    })
  }
}

