const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "annonce",
  use: "**/annonce [texte]**",
  description: "Permet de faire une annonce aux autres joueurs",
  options: [],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (data.cash >= client.get("market/annonce").price){
        Agence.findOneAndUpdate({ userID: message.author.id }, { cash: data.cash - client.get("market/annonce").price}).then(() => {
          AgenceManager.waitAnnonceMessage(client, message)
        }).catch(err => { console.error(err) })
  
        return EmbedMessage.showSuccess(
          client,
          "**Annonce - En attente**",
          `Vous avez maintenant 10 secondes pour transmettre votre annonce...`,
          message.author
        )
      }else{
        return EmbedMessage.showError(client, "**Annonce - Erreur**", `Il vous manque **${1500 - data.cash}$** pour envoyer votre annonce !`)
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
