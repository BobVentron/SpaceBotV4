const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager")

module.exports = {
  name: "joinbourse",
  use: "**/joinbourse [@joueur]**",
  description: "Permet de rejoindre le bourse de du joueur mentionner.",
  options: [
    {
      name: "joueur",
      description: "entreprise que vous voullez rejoindre.",
      type: 6,
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (await AgenceManager.targetExists(message.mention.id)) {
        let mention = await AgenceManager.getOneByUserID(message.mention.id);
        if (mention.enbourse === 1){
          let pourcent = mention.pointdebourse
          let bourse = parseInt( pourcent + ((mention.bank + mention.cash)/1500))
          let prixjoin = parseInt(bourse*3.3)
          if(data.bourse1 === null || 0){
            if(data.cash > prixjoin){
              Agence.findOneAndUpdate({ userID: message.author.id }, {
                cash: data.cash - prixjoin,
                bourse1: message.mention.id
              }).catch(err => { console.error(err) })
              Agence.findOneAndUpdate({ userID: mention }, {
                bank: prixjoin/2
              }).catch(err => { console.error(err) })
              return EmbedMessage.showSuccess(client,
                "**Bourse**",
                `Vous venez de rejoindre la bourse de ${message.mention} !`,
                message.author.username
              )
            }else{
              return EmbedMessage.showError(client, "**Bourse - Erreur**", `Vous n'avez pas l'argent nécessaire !`)
            }
          }else if(data.bourse2 === null || 0){
            if(data.cash > prixjoin){
              Agence.findOneAndUpdate({ userID: message.author.id }, {
                cash: data.cash - prixjoin,
                bourse2: message.mention.id
              }).catch(err => { console.error(err) })
              Agence.findOneAndUpdate({ userID: mention }, {
                bank: prixjoin/2
              }).catch(err => { console.error(err) })
              return EmbedMessage.showSuccess(client,
                "**Bourse**",
                `Vous venez de rejoindre la bourse de ${message.mention} !`,
                message.author.username
              )
            }else{
              return EmbedMessage.showError(client, "**Bourse - Erreur**", `Vous n'avez pas l'argent nécessaire !`)
            }
          }else if(data.bourse3 === null|| 0 ){
            if(data.cash > prixjoin){
              Agence.findOneAndUpdate({ userID: message.author.id }, {
                cash: data.cash - prixjoin,
                bourse3: message.mention.id
              }).catch(err => { console.error(err) })
              Agence.findOneAndUpdate({ userID: mention }, {
                bank: prixjoin/2
              }).catch(err => { console.error(err) })
              return EmbedMessage.showSuccess(client,
                "**Bourse**",
                `Vous venez de rejoindre la bourse de ${message.mention} !`,
                message.author.username
              )
            }else{
              return EmbedMessage.showError(client, "**Bourse - Erreur**", `Vous n'avez pas l'argent nécessaire !`)
            }
          }else{
            return EmbedMessage.showError(client, "**Bourse - Erreur**", `Vous pouvez avoir au maximum 3 actions !`)
          }
        }else{
          return EmbedMessage.showError(client, "**Bourse - Erreur**", `Vous ne pouvez pas rejoindre la bourse de cette persone car il n'en a pas !`)
        }
      }else{
        return EmbedMessage.anyAgenceError(client, message.author)
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
