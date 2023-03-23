const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const GuerreManager = require("./GuerreManager");
const RavitaillementManager = require("./RavitaillementManager");
const RocketManager = require("./RocketManager");
const PasDeTirManager = require("./PasDeTirManager");
const RavitaillementEvent = require("../util/RavitaillementEvent");

class AgenceManager {

  static async targetExists (userID) {
    let result = await Agence.exists({ userID })
      .then(doc => {
        return doc
      }).catch(err => {
        console.error(err)
      })
    return result
  }

  static getOneByUserID (userID) {
    let result = Agence.findOne({ userID })
      .then(agence => {
        return agence
      }).catch(err => {
        console.error(err)
      })
    return result
  }

  static evaluateLevel (agence, client, message) {
    let NiveauUpdate = parseInt(agence.level);
    let workminUpdate = parseInt(agence.workmin);
    let workmaxUpdate = parseInt(agence.workmax);
    if ((Math.exp(((agence.level) + 1) / 1.7) - 0.8) * 100 <= agence.experience) {
      NiveauUpdate = NiveauUpdate + 1;
      workminUpdate = workminUpdate + 50;
      workmaxUpdate = workmaxUpdate + 100;
      Agence.findOneAndUpdate({ userID: message.author.id },
        { workmax: workmaxUpdate, workmin: workminUpdate, level: NiveauUpdate },
        function (err, data) {
          if (err) {
            console.error(err)
          } else {
            message.channel.send({
              embeds: [EmbedMessage.showSuccess(
                client,
                "**Info**",
                `Bravo, vous venez de passer niveau ${data.level + 1}`,
                message.author
              )]
            })
          }
        }
      )
    }
  }

  static makeAgenceLaunch (client, message, data, reusableTiers, rocket, pdt) {
    setTimeout(() => {
      if(rocket.type == 'CHRISTMAS TIME'){
        message.channel.send({
          embeds: [new EmbedMessage(client, {
            title: "**Launch**",
            description: `...`,
            author: message.author.username,
            thumbnail: true,
            image: "https://media.giphy.com/media/CNKOHfK7NFVSw/giphy.gif"
          })]
        })
        
      }else{
        message.channel.send({
          embeds: [new EmbedMessage(client, {
            title: "**Launch**",
            description: `Déplacement de **${rocket.name}** jusqu'au pas de tir **${pdt.name}** ...`,
            author: message.author.username,
            thumbnail: true,
            image: "https://media.giphy.com/media/l2QE0qijk8s1jfTeE/giphy.gif"
          })]
        })
      }
      setTimeout(() => {
        message.channel.send("**Remplissage en ergol de la fusée...**")
        setTimeout(() => {
          message.channel.send("**3**")
          setTimeout(() => {
            message.channel.send("**2**")
            setTimeout(() => {
              message.channel.send("**1**")
              setTimeout(() => {
                let boom = Math.floor(Math.random() * 20 + 1)
                if (boom === 8 || rocket.type == 'CHRISTMAS TIME') {
                  if(rocket.type == 'CHRISTMAS TIME'){
                    message.channel.send({
                      embeds: [new EmbedMessage(client, {
                        title: "**Launch - OH OOHH OOOHHH**",
                        description: `**Surprise !**`,
                        author: message.author.username,
                        thumbnail: true,
                        image: "https://media.giphy.com/media/9REjzSU7xhLsUDSgzk/giphy.gif"
                      })]
                    })
                    Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + 7500, cash: data.cash + 10000, science: data.science + 7500 }).catch(err => { console.error(err) })
                    message.channel.send({
                      embeds: [EmbedMessage.showSuccess(client, "**CHRISTMAS - Succès**", `J'avais oublié, voilà pour toi ${message.author.username} : **10000$, 7500 XP, et 7500 points de science** ! A l'année prochaine 😎`, message.author)]
                    })
                  }else{
                    RocketManager.deleteRocket(userID, rocket.name)
                    message.channel.send({
                      embeds: [new EmbedMessage(client, {
                        title: "**Launch - Echec**",
                        description: `**Ta fusée vient d'exploser en vol !**`,
                        author: message.author.username,
                        thumbnail: true,
                        image: "https://media.giphy.com/media/tyttpH524O4pGJx8JWg/giphy.gif"
                      })]
                    })
                  }
                } else {
                  let Updated = parseInt(data.Launch) + 1;
                  Agence.findOneAndUpdate({ userID: message.author.id },
                    { Launch: Updated }).catch(err => { console.error(err) })

                  message.channel.send({
                    embeds: [new EmbedMessage(client, {
                      title: "**Launch - Succès**",
                      description: `**Ta fusée vient d'atteindre l'orbite avec succès !**`,
                      author: message.author.username,
                      thumbnail: true,
                      image: "https://media.giphy.com/media/mi6DsSSNKDbUY/giphy.gif"
                    })]
                  })

                  if (rocket.payload != null) {
                    message.channel.send({
                      embeds: [new EmbedMessage(client, {
                        title: "**Launch - Succès**",
                        description: `Mise en orbite de la charge utile (**${rocket.payload}**) ...`,
                        author: message.author.username,
                        thumbnail: true,
                        image: "https://media.giphy.com/media/SiM1Su83stF8untgcB/giphy.gif"
                      })]
                    })

                    RocketManager.updateRocketPayload(message.author.id, rocket.name, null)

                    new Promise(function (resolve, reject) {
                      resolve(RavitaillementManager.getCurrentRavitaillement())
                    }).then(result => {
                      if (result != null) {
                        message.channel.send({
                          embeds: [new EmbedMessage(client, {
                            title: "**Ravitaillement - Succès**",
                            description: `La charge utile "**${rocket.payload}**" a été transférée à l'ISS, bravo !`,
                            author: message.author.username,
                            thumbnail: true,
                            image: "https://media.giphy.com/media/2VJnUxYdtw2gy3yYnV/giphy.gif"
                          })]
                        })
                        const xpWon = this.evaluateRavitaillementReward(data, rocket)
                        RavitaillementEvent.checkRavitaillementState(client, { agence: data, reward: xpWon })
                      }
                    }).catch(err => { console.error(err) })
                  }

                  if (!reusableTiers.includes(rocket.type.replace("tiers", "t"))) {
                    RocketManager.deleteRocket(message.author.id, rocket.name)
                  }

                  let participedToGuerreFroide = null
                  if (data.USAJoin == 1 && pdt.location == "USA") {
                    participedToGuerreFroide = GuerreManager.participer(rocket.type.replace("tiers", "t"), "USA")
                  }
                  if (data.RussieJoin == 1 && pdt.location == "Russie") {
                    participedToGuerreFroide = GuerreManager.participer(rocket.type.replace("tiers", "t"), "Russie")
                  }
                  if (participedToGuerreFroide != null) {
                    message.channel.send({
                      embeds: [EmbedMessage.showSuccess(
                        client,
                        "**Conquête spatiale - Succès**",
                        `Bravo, vous venez d'accorder de nouveaux points à votre équipe !`,
                        message.author
                      )]
                    })
                  }

                  if (rocket.type.replace("tiers", "t") === "t1") {
                    Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (1500 - 1000) + 1000)) }).catch(err => { console.error(err) })
                  } else if (rocket.type.replace("tiers", "t") === "t2") {
                    Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (8500 - 7500) + 7500)) }).catch(err => { console.error(err) })
                  } else if (rocket.type.replace("tiers", "t") === "t3") {
                    Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (21000 - 19000) + 19000)) }).catch(err => { console.error(err) })
                  }
                  if (reusableTiers.includes(rocket.type.replace("tiers", "t"))) {
                    message.channel.send({
                      embeds: [new EmbedMessage(client, {
                        title: "**Launch**",
                        description: `**Désorbitation en cours ...**`,
                        author: message.author.username
                      })]
                    })
                    setTimeout(() => {
                      let random = Math.floor(Math.random() * 100 + 1)
                      let pourcentOfBoom = 5 * rocket.successLaunches
                      if (random <= pourcentOfBoom) {
                        RocketManager.deleteRocket(message.author.id, rocket.name)
                        if (pdt.rocketID != null && pdt.rocketID == rocket._id) {
                          PasDeTirManager.unlinkRocketToPdt(message.author.id, pdt)
                        }
                        message.channel.send({
                          embeds: [new EmbedMessage(client, {
                            title: "**Launch - Echec**",
                            description: `**Ta fusée vient d'exploser en atterrissant !**`,
                            author: message.author.username,
                            thumbnail: true,
                            image: "https://media1.tenor.com/images/caa01601c49a179f61f6f8c0662822ae/tenor.gif?itemid=20209825"
                          })]
                        })
                      } else {
                        RocketManager.updateRocketSuccessLaunches(message.author.id, rocket.name, rocket.successLaunches + 1)

                        if (rocket.type.replace("tiers", "t") === "t4") {
                          Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (50000 - 54000) + 54000)) }).catch(err => { console.error(err) })
                        } else if (rocket.type.replace("tiers", "t") === "t5") {
                          Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (88000 - 92000) + 92000)) }).catch(err => { console.error(err) })
                        } else if (rocket.type.replace("tiers", "t") === "t6") {
                          Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (158000 - 162000) + 162000)) }).catch(err => { console.error(err) })
                        }

                        if (pdt.rocketID == null) {
                          PasDeTirManager.linkRocketToPdt(message.author.id, pdt, rocket)
                        }

                        message.channel.send({
                          embeds: [new EmbedMessage(client, {
                            title: "**Launch - Succès**",
                            description: `**Ta fusée vient d'atterrir avec succès !**`,
                            author: message.author.username,
                            thumbnail: true,
                            image: "https://media1.tenor.com/images/63c4da9195fc30bda5a6e77b22916c2d/tenor.gif?itemid=21547821"
                          })]
                        })
                      }
                    }, 7500);
                  }
                }
              }, 7500);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 3000)
    }, 3000)
    AgenceManager.evaluateLevel(data, client, message)
  }

  static waitDescriptionMessage (client, message) {
    const filter = m => (m.author.id == message.author.id && m.author.id != client.user.id)

    const collector = message.channel.createMessageCollector({ filter, time: 10000 });
    collector.on('collect', message => {
      let messagesSentByUser = 0
      for (let [key, value] of collector.collected.entries()) {
        if (value.author.id == message.author.id) {
          messagesSentByUser = messagesSentByUser + 1
        }
      }
      if (messagesSentByUser == 1) {
        Agence.findOneAndUpdate({ userID: message.author.id }, { description: message.content })
          .catch(err => { console.error(err) })
        message.channel.send({
          embeds: [EmbedMessage.showSuccess(
            client,
            "Succès",
            `La description de votre agence a été changée par : ${message.content}`,
            message.author
          )]
        })
      }
    })
  }

  static waitAnnonceMessage (client, message) {
    const filter = m => (m.author.id == message.author.id && m.author.id != client.user.id)

    const collector = message.channel.createMessageCollector({ filter, time: 10000 });
    collector.on('collect', message => {
      let messagesSentByUser = 0
      for (let [key, value] of collector.collected.entries()) {
        if (value.author.id == message.author.id) {
          messagesSentByUser = messagesSentByUser + 1
        }
      }
      if (messagesSentByUser == 1) {
        message.channel.send({
          embeds: [
            EmbedMessage.showSuccess(
              client,
              `**${message.author.username} - Annonce**`,
              message.content,
              message.author
            )]
        })
      }
    })
  }

  static evaluateRavitaillementReward (agence, rocket) {
    let xpToAdd = 0
    switch (rocket.type.replace("tiers", "t")) {
      case "t1":
        xpToAdd = agence.experience * 0.10
        break;
      case "t2":
        xpToAdd = agence.experience * 0.15
        break;
      case "t3":
        xpToAdd = agence.experience * 0.20
        break;
      case "t4":
        xpToAdd = agence.experience * 0.25
        break;
      case "t5":
        xpToAdd = agence.experience * 0.30
        break;
      case "t6":
        xpToAdd = agence.experience * 0.35
        break;
    }
    Agence.findOneAndUpdate({ userID: agence.userID }, { experience: agence.experience + xpToAdd }).catch(err => { console.error(err) })
    return xpToAdd
  }

  static claimChristmasReward (agence, claimType, amount){
    let day = new Date().getDate();
    let hasLate = agence.hasChristmasCalendarLate;
    if (!hasLate && (day - agence.lastClaimDay) > 1){
      hasLate = true;
    }
    let dataToUpdate = { hasChristmasCalendarLate: hasLate, lastClaimDay: day }
    switch(claimType) {
      case "money":
        dataToUpdate.cash = agence.cash + amount;
        break;
      case "ergol":
        dataToUpdate.ergol = agence.ergol + amount;
        break;
      case "pds":
        dataToUpdate.science = agence.science + amount;
        break;
      case "xp":
        dataToUpdate.xp = agence.xp + amount;
        break;
    }
    Agence.findOneAndUpdate({ userID: agence.userID }, dataToUpdate).catch(err => { console.error(err) })
  }

  static async claimPopReward (userID, claimType, amount) {
    const agence = await AgenceManager.getOneByUserID(userID);
    let dataToUpdate = {}
    switch (claimType) {
      case "money":
        dataToUpdate.cash = agence.cash + amount;
        break;
      case "ergol":
        dataToUpdate.ergol = agence.ergol + amount;
        break;
      case "pds":
        dataToUpdate.science = agence.science + amount;
        break;
      case "xp":
        dataToUpdate.xp = agence.xp + amount;
        break;
    }
    Agence.findOneAndUpdate({ userID: agence.userID }, dataToUpdate).catch(err => { console.error(err) })
  }
}

module.exports = AgenceManager;
