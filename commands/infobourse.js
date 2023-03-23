const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager")

module.exports = {
  name: "infobourse",
  use: "**/infobourse [@joueur]**",
  description: "Permet de connaitre les statistiques de la bourse de la personne mentionnée !",
  options: [
    {
      name: "joueur",
      description: "Statistiques de la bourse de la personne.",
      type: 6,
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id);
      if(message.mention){
        if (await AgenceManager.targetExists(message.mention.id)) {
          data = await AgenceManager.getOneByUserID(message.mention.id);
        } else {
          return EmbedMessage.showError(client, "**Info Bourse - Erreur**", "Cette personne n'a pas créée d'agence spatiale !")
        }
      }
      if (data.enbourse === 1) {
        let bourse = parseInt(data.pointdebourse + ((data.bank + data.cash) / 1500))
        return new EmbedMessage(client, {
          title: "**Info Bourse**",
          description: `La bourse de cette personne est de ${bourse} point! \n Rejoindre sa bourse vous coûtera ${parseInt(bourse * 3.3)}$\n.Sa bourse rapporte ${parseInt(bourse * 0.68)}$ toutes les 6h !`,
          author: message.author.username,
          thumbnail: true
        })
      } else {
        return EmbedMessage.showError(client, "**Info Bourse - Erreur**", `L'agence spatiale de cette personne n'est pas en bourse !`)
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}