const EmbedMessage = require("../util/EmbedMessage");
const RocketManager = require("../managers/RocketManager");
const AgenceManager = require("../managers/AgenceManager");
const Agence = require("../models/agence");

module.exports = {
  name: "payload",
  use: "**/payload [nom de votre fusée] [charge utile à définir]**",
  description: "Permet de consulter la liste de ses fusées prêtes pour un lancement.",
  options: [
    {
      name: "nom",
      description: "nom de la fusée concernée",
      type: 3,
      required: true
    },
    {
      name: "charge",
      description: "charge utile de la coiffe à définir",
      type: 3,
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {

    const tiersPrice = {
      "tiers1": client.get("rockets/t1").payload,
      "tiers2": client.get("rockets/t2").payload,
      "tiers3": client.get("rockets/t3").payload,
      "tiers4": client.get("rockets/t4").payload,
      "tiers5": client.get("rockets/t5").payload,
      "tiers6": client.get("rockets/t6").payload
    };

    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id);
      if (await RocketManager.rocketExists(message.author.id, args[0])) {
        const rocket = await RocketManager.getRocketByUserIDAndName(message.author.id, args[0]);
        if (data.cash >= tiersPrice[rocket.type]) {
          RocketManager.updateRocketPayload(message.author.id, args[0], args[1])
          Agence.findOneAndUpdate({ userID: message.author.id }, { cash: data.cash - tiersPrice[rocket.type] }).catch(err => console.log(err));
          return EmbedMessage.showSuccess(client, "**Payload - Succès**", `Votre fusée **${args[0]}** a maintenant **${args[1]}** dans sa coiffe !`, message.author)
        } else {
          return EmbedMessage.showError(client, "**Payload - Erreur**", `Il vous manque ${tiersPrice[rocket.type] - data.cash}$ pour pouvoir effectuer cette action.`)
        }
      } else {
        return EmbedMessage.showError(client, "**Payload - Erreur**", `Vous ne possédez pas de fusée au nom de **${args[0]}** !`)
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}