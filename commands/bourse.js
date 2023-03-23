const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager")

module.exports = {
  name: "bourse",
  use: "**/bourse**",
  description: "Permet d'obtenir les gain des bourses.",
  options: [ ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      const time = new Date().getTime();
      if (time - data.lastbourse < 21600000) {
        let remainingTime = data.lastbourse - time + 21600000;
        let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        let secondes = Math.floor((remainingTime % (1000 * 60)) / (1000));
        return new EmbedMessage(client, {
            title: "**Bourse**",
            description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir executer la commande de nouveau.`,
            author: message.author.username
        })
        } else {
        let description = " ";
        let gaintotal = 0;
        if(!data.bourse1 != null){
            if (await AgenceManager.targetExists(data.bourse1)) {
                let mention = await AgenceManager.getOneByUserID(data.bourse1);
                let bourse = parseInt( mention.pointdebourse + ((mention.bank + mention.cash)/1500))
                let gain = parseInt(bourse*0.68)
                gaintotal = gain + gaintotal;
            }else{
                return EmbedMessage.anyAgenceError(client, data.bourse1)
            }
        }else{
            description = "Vous n'avez aucune bourse !"
        }
        if(!data.bourse2 != null){
            let mention = await AgenceManager.getOneByUserID(data.bourse2);
            let bourse = parseInt( mention.pointdebourse + ((mention.bank + mention.cash)/1500))
            let gain = parseInt(bourse*0.68)
            gaintotal = gain + gaintotal;
        }
        if(!data.bourse3 != null){
            let mention = await AgenceManager.getOneByUserID(data.bourse3);
            let bourse = parseInt( mention.pointdebourse + ((mention.bank + mention.cash)/1500))
            let gain = parseInt(bourse*0.68)
            gaintotal = gain + gaintotal;
        }

        Agence.findOneAndUpdate({ userID: message.author.id }, {
            cash: data.cash + gaintotal,
            lastbourse: time
        }).catch(err => { console.error(err) })

        return new EmbedMessage(client, {
            title: "**Bourse - Succès**",
            description: `Vous venez de récupérer toutes vos bourses, elles vous ont fait gagner **${gaintotal}$** !`,
            author: message.author.username,
            thumbnail: true
        }) 
        }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}