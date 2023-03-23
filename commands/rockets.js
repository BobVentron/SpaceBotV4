const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const RocketManager = require("../managers/RocketManager");
const PasDeTirManager = require("../managers/PasDeTirManager");

module.exports = {
  name: "rockets",
  use: "**/rockets**",
  description: "Permet de consulter la liste de ses fusées disponible, la fiche d'une de ses fusées ou la liste des fusées d'un joueur",
  options: [
    {
      name: "nom",
      description: "Nom de la fusée",
      type: 3,
      required: false
    },
    {
      name: "joueur",
      description: "Joueur ciblé",
      type: 6,
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      if (args.length == 0 || message.mention) {
        const rockets = await RocketManager.getRocketsByUserID(message.mention ? message.mention.id : message.author.id);
        if (rockets.length > 0) {
          let result = []

          for (const rocket of rockets) {
            let potentialPdt = await PasDeTirManager.getPdtByUserIdAndRocket(message.mention ? message.mention.id : message.author.id, rocket)
            if (potentialPdt != null) {
              result.push({ name: rocket.name, content: (`Fusée de tiers ${rocket.type.replace("tiers", "")} - ${rocket.location} - Charge utile : ${rocket.payload != null ? rocket.payload : 'Aucune'} - Sur le pas de tir **${potentialPdt.name}**`) })
            } else {
              result.push({ name: rocket.name, content: (`Fusée de tiers ${rocket.type.replace("tiers", "")} - ${rocket.location} - Charge utile : ${rocket.payload != null ? rocket.payload : 'Aucune'}`) })
            }
          }

          return new EmbedMessage(client, {
            title: `**${message.mention ? message.mention.username : message.author.username} - Fusées :**`,
            content: result,
            thumbnail: true,
            author: message.author.username,
          })
        } else {
          if (message.mention) {
            return EmbedMessage.showError(client, "**Rockets - Erreur**", "Cette personne ne possède aucune fusée actuellement...");
          } else {
            return EmbedMessage.showError(client, "**Rockets - Erreur**", "Vous ne possédez aucune fusée actuellement...");
          }
        }
      } else {
        if (await RocketManager.rocketExists(message.author.id, args[0])) {
          let rocket = await RocketManager.getRocketByUserIDAndName(message.author.id, args[0])
          let texte = `**:receipt: Type** : ${new String(rocket.type).replace("tiers", "tiers ")}\n`
          texte = texte + `**:satellite_orbital: Charge utile** : ${rocket.payload != null ? rocket.payload : 'Aucune'}\n`
          texte = texte + `**:earth_africa: Localisation** : ${rocket.location}\n`
          texte = texte + `**:white_check_mark: Lancements réussis** : ${rocket.successLaunches}\n`

          if (rocket.image == null) {
            return new EmbedMessage(client, {
              title: `**${rocket.name} - Infos :**`,
              description: texte,
              author: message.author.username,
            })
          } else {
            return new EmbedMessage(client, {
              title: `**${rocket.name} - Infos :**`,
              description: texte,
              author: message.author.username,
              image: rocket.image
            })
          }
        } else {
          return EmbedMessage.showError(client, "**Rename - Erreur**", `Vous ne possédez aucune fusée au nom de **${args[0]}** !`)
        }
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}