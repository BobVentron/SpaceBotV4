const EmbedMessage = require("../util/EmbedMessage");
const Discord = require("discord.js");
const Agence = require("../models/agence");
const AgenceManager = require("../managers/AgenceManager");


module.exports = {
  name: "createbourse",
  use: "**/createbourse**",
  description: "Permet créer la bourse pour son agence spacial.",
  options: [ ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if( data.enbourse === 0){
        if(data.level < 5){
          return EmbedMessage.showError(client,
              "**Bourse - Erreur**",
            `Votre agence n'a pas le niveau requis pour entrer en bourse. \n Revenez quand elle sera niveau 5 !`
            )
        }else{

          Agence.findOneAndUpdate({ userID: message.author.id },
            { enbourse: 1 }).catch(err => { console.error(err) })

          return EmbedMessage.showSuccess(client,
              "**Bourse - Succès**",
            `Bravo, votre agence est entrée en bourse ! Quand quelqu'un investira dans votre agence, vos gagnerez une récompense. Vous pouvez également investir dans d'autres agences !`,
            message.author
            )
        }
      }else{
        return EmbedMessage.showError(client,
            "**Bourse - Erreur**",
            `Votre agence est déjà entrée en bourse !`
          )
      }
    } else {
      message.channel.send(EmbedMessage.anyAgenceError(client, message.author));
    }
  }
}