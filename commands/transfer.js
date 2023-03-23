const AgenceManager = require('../managers/AgenceManager');
const TransactionsManager = require('../managers/TransactionsManager');
const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
  name: "transfert",
  use: "**/transfert <Joueur> [montant]**",
  description: "Creer / consulter une transaction(s) pour un joueur.",
  options: [
    {
      name: "joueur",
      description: "Joueur cible.",
      type: 6,
      required: true
    },
    {
      name: "montant",
      description: "Montant que vous voulez donner a ce joueur",
      type: 4,
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if(await AgenceManager.targetExists(message.author.id)){
      let data = await AgenceManager.getOneByUserID(message.author.id);
      let mention = message.mention;
      if(message.mention){
        if(await AgenceManager.targetExists(mention.id)){
          let targetData = await AgenceManager.getOneByUserID(mention.id);
          switch(args.length){
            case 1:
              const transactions = await TransactionsManager.getTransactionsByUserID(targetData.userID);
              let result = [];
              if(transactions.length > 0){
                for(const transaction of transactions){
                  const targetAgence = await AgenceManager.getOneByUserID(transaction.targetID);
                  result.push({ name: `${targetAgence.agenceName} (${targetAgence.username})`, content: `+${transaction.amount}$` })
                }
                return new EmbedMessage(client, {
                  title: "**Transfer - Succès**",
                  content: result,
                  thumbnail: true,
                  author: message.author.username
                })
              }else{
                return EmbedMessage.showError(client, "**Transfer - Erreur**", "Aucune transaction n'a été effectuée pour ce joueur.", message.author);
              }
            case 2:
              const amount = parseInt(args[1]);
              if (data.cash >= amount) {
                TransactionsManager.addTransaction(data, targetData, amount);
                return EmbedMessage.showSuccess(client, "**Transfer - Succès**", `Vous venez de transférer ${amount}$ à **${targetData.agenceName}** !`, message.author);
              } else {
                return EmbedMessage.showError(client, "Erreur", `Vous n'avez pas assez d'argent sur votre compte !`)
              }
            default:
              return EmbedMessage.showError(client, "**Transfer - Erreur**", "Veuillez utiliser la commande comme ceci : " + this.use);
          }
        }else{
          return EmbedMessage.anyAgenceError(client, message.author);
        }
      }else{
        return EmbedMessage.showError(client, "**Transfer - Erreur**", "Vous devez mentionner un joueur !");
      }
    }else{
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}