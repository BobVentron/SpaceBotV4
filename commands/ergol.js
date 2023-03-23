const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "ergol",
  use: "**/ergol [usine (optionnel)]**",
  description: "Vous permet de récolter vos productions journalières d'ergol ou d'acheter de nouvelles usines.",
  options: [
    {
      name: "usine",
      description: "Usine que vous souhaitez acheter",
      type: 3,
      choices: [
        { name: "Usine tiers 1", value: "usineErgol1" },
        { name: "Usine tiers 2", value: "usineErgol2" },
        { name: "Usine tiers 3", value: "usineErgol3" },
      ],
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {
    const time = new Date().getTime()
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (args.length == 0) {
        if (data.usineErgol1 === 0 && data.usineErgol2 === 0 && data.usineErgol3 === 0) {
          return new EmbedMessage(client, {
            title: "**Ergol - Erreur**",
            description: "Tu ne possèdes aucune usine à ergol actuellement ...",
            author: message.author.username
          })
        } else {
          if (time - data.lastErgol < 28800000) {
            let reainingTime = data.lastErgol - time + 28800000
            let hours = Math.floor((reainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((reainingTime % (1000 * 60 * 60)) / (1000 * 60));
            let secondes = Math.floor((reainingTime % (1000 * 60)) / (1000));
            return new EmbedMessage(client, {
              title: "**Ergol - Erreur**",
              description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir executer la commande de nouveau !`,
              author: message.author.username
            })
          } else {
            let ergolWin = 0;
            let description = "";
            if (data.usineErgol3 === 1) {
              ergolWin = ergolWin + 250;
              description = description + `\nVous venez de récupérer les **250 tonnes d'ergol** produites par l'usine de Tiers 3.`
            };
            if (data.usineErgol2 === 1) {
              ergolWin = ergolWin + 150;
              description = description + `\nVous venez de récupérer les **150 tonnes** d'ergol produites par l'usine de Tiers 2.`
            };
            if (data.usineErgol1 === 1) {
              ergolWin = ergolWin + 50;
              description = description + `\nVous venez de récupérer les **50 tonnes** d'ergol produites par l'usine de Tiers 1.`
            };
            let ergolUpdated = data.ergol + ergolWin
            Agence.findOneAndUpdate({ userID: message.author.id },
              { ergol: ergolUpdated, lastErgol: time }).catch(err => { console.error(err) })
            return EmbedMessage.showSuccess(
              client,
              "**Ergol - Succès**",
              description,
              message.author
            )
          }
        }
      } else {
        let usine = '';
        let dataToUpdate = null;
        let usineCost = null;
        switch (args[0]) {
          case "usineErgol1":
            usine = "Usine tiers 1"
            usineCost = client.get("ergols/usineergol1").price
            if (data.usineErgol1 == 1) {
              return this.alreadyHaveErgolError(client, message, usine)
            } else {
              if (data.cash < usineCost) {
                return this.notEnoughMoneyError(client, message)
              } else {
                dataToUpdate = { cash: data.cash - usineCost, usineErgol1: 1, experience: data.experience + 500 }
              }
            }
            break;
          case "usineErgol2":
            usine = "Usine tiers 2"
            usineCost = client.get("ergols/usineergol2").price
            if (data.usineErgol2 == 1) {
              return this.alreadyHaveErgolError(client, message, usine)
            } else {
              if (data.cash < usineCost) {
                return this.notEnoughMoneyError(client, message)
              } else {
                dataToUpdate = { cash: data.cash - usineCost, usineErgol2: 1, experience: data.experience + 850 }
              }
            }
            break;
          case "usineErgol3":
            usine = "Usine tiers 3"
            usineCost = client.get("ergols/usineergol3").price
            if (data.usineErgol3 == 1) {
              return this.alreadyHaveErgolError(client, message, usine)
            } else {
              if (data.cash < usineCost) {
                return this.notEnoughMoneyError(client, message)
              } else {
                dataToUpdate = { cash: data.cash - usineCost, usineErgol3: 1, experience: data.experience + 1700 }
              }
            }
            break;
        }

        Agence.findOneAndUpdate({ userID: message.author.id }, dataToUpdate).catch(err => { console.error(err) })
        AgenceManager.evaluateLevel(data, client, message)
        return EmbedMessage.showSuccess(
          client,
          "**Ergol - Succès**",
          `Bravo tu viens d'acheter une nouvelle production d'ergol de **tiers ${new String(args[0]).replace("usineErgol", "")}** !`,
          message.author
        )
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  },

  notEnoughMoneyError (client, message) {
    return new EmbedMessage(client, {
      title: "**Ergol:**",
      description: "Tu n'as pas assez d'argent pour acheter celà !",
      author: message.author.username
    })
  },
  alreadyHaveErgolError (client, message, usine) {
    return new EmbedMessage(client, {
      title: "**Ergol:**",
      description: `Tu as déjà acheté l'**${usine}** !`,
      author: message.author.username
    })
  }
}