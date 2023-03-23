const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
    name: "update",
    use: "**/update**",
    description: "Vous permet de savoir les derniers changements du bot.",
    options: [],
    admin: false,
    async execute (client, message, args) {

        let desc = '\nLa V4 de Spacebot est là ! Voici les modifications / ajouts apportés au bot :\n\n' +
            '**Nouveautés :**\n' +
            '- Vos fusées sont personnalisables ! Un paramètre en plus a été ajouté aux commandes /buy et /buypdt, qui vous permet de nommer vos fusées.\n' +
            '- Vous pouvez maintenant ajouter une charge utile à vos fusées en utilisant la commande /payload !\n' +
            '- Vos fusées peuvent maintenant avoir une image associée, qui apparaît lors du lancement de celle-ci. Pour en ajouter une, utilisez /logo entité fusée\n' +
            '- Les commandes /rockets et /pasdetir sont arrivées, et vous permettent de voir l\'ensemble de vos fusées / pas de tir ;) !\n' +
            '- La mise en bourse de vos agences est dorénavant possible ! Utilisez /bourse pour en savoir plus.\n' +
            '- Un système d\'ergol a été mis en place : Vous devrez maintenant acheter des usines à ergols qui vous permettront de produire de l\'ergol pour le décollage de vos fusées. Plus le tiers est élevé, plus le coût en ergol sera élevé.\n' +
            '- La commande /annonce fait son apparition et vous permet de faire une annonce générale contre 1500$ !\n' +
            '- Un évent de ravitaillement a été mit en place et s\'activera aléatoirement chaque semaine, le premier à lancer une fusée après l\'annonce remporte une récompense en fonction de la fusée lancée !\n' +
            '- Le calendrier de l\'avent, un petit truc sympa vous attend le 25 décembre 😇\n\n' +
            '**Corrections :**\n' +
            '- La probabilité d\'explosion des fusées à l\'attérissage a été revue : Elle est maintenant calculée grâce au nombre de lancements réussis par celle-ci. Plus le nombre de succès est élevé, plus le risque d\'explosion est important.\n' +
            '- La météo a été corrigée, et elle se met à jour toute les 4h automatiquement.\n' +
            '- Le bot arrête de spam a tout bout de champs toutes les X heures avec le même message, un message aléatoire apparaît toute les heures\n\n' +
            '**V4.1 :**\n' +
            '- Suppression de l\'arbre des technologies le temps d\'avoir une version stable\n' +
            '- Ajout de la commande /transfer pour transférer de l\'argent entre vos agences\n' +
            '- Modification des prix des fusées : T1 (5000 -> 7500), T3 (70k -> 80k), T4 (160k -> 180k), T5 (250k -> 300k), T6 (400k -> 450k)\n' +
            '- Modification prix des actions niveau 2 : Ariane Espace (4500 -> 25k), Blue Origin (10k -> 30k), SpaceX (20k -> 40k)\n' +
            '- Ajouter une charge utile à votre fusée vous coûtera désormais 2500$\n' +
            '- Activation de l\'event de ravitaillement vers l\'ISS\n' +
            '- Conquête spatiale is back.\n';


        return new EmbedMessage(client, {
            title: "**Spacebot - Changelog**",
            description: desc,
            thumbnail: true,
            author: message.author.username
        })
    }
}