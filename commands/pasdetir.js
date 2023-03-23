const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const PasDeTirManager = require("../managers/PasDeTirManager");

module.exports = {
  name: "pasdetir",
  use: "**/pasdetir**",
  description: "Permet de consulter la liste de ses pas de tir.",
  options: [],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      const pdt = await PasDeTirManager.getPdtByUserID(message.author.id)
      if (pdt.length > 0) {
        let result = []
        pdt.forEach(item => {
          result.push({ name: item.name, content: (`Localisation: ${item.location} - Disponible : ${item.available ? 'Oui' : 'Non'}`) })
        });

        return new EmbedMessage(client, {
          title: `**${message.author.username} - Pas de tir :**`,
          content: result,
          thumbnail: true,
          author: message.author.username,
        })
      } else {
        return EmbedMessage.showError(client, "**Pas de tir - Erreur**", "Vous ne possédez aucun pas de tir actuellement...");
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}