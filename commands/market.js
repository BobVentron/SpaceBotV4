const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
    name: "market",
    use: "**/market**",
    description: "Vous permet de savoir le prix des choses que vous pouvez acheter.",
    options: [],
    admin: false,
    async execute (client, message, args) {
        const items = [
            { nom: "🚀 Fusée", levels: [
                { nom: "Tiers 1", prix: client.get("rockets/t1").price, pds: client.get("rockets/t1").pds },
                { nom: "\nTiers 2", prix: client.get("rockets/t2").price, pds: client.get("rockets/t2").pds },
                { nom: "\nTiers 3", prix: client.get("rockets/t3").price, pds: client.get("rockets/t3").pds },
                { nom: "\nTiers 4", prix: client.get("rockets/t4").price, pds: client.get("rockets/t4").pds },
                { nom: "\nTiers 5", prix: client.get("rockets/t5").price, pds: client.get("rockets/t5").pds },
                { nom: "\nTiers 6", prix: client.get("rockets/t6").price, pds: client.get("rockets/t6").pds }
            ]},
            { nom: "🏗️ Pas de tir", levels: [
                { nom: "Guyane", prix: client.get("pdt/guyane").price },
                { nom: "Chine", prix: client.get("pdt/chine").price },
                { nom: "Russie", prix: client.get("pdt/russie").price },
                { nom: "USA", prix: client.get("pdt/usa").price },
            ]},
            { nom: "💸 Action", levels: [
                { nom: "Ariane Espace lvl 1", prix: client.get("actions/arianeespaceniv1").price },
                { nom: "Ariane Espace lvl 2", prix: client.get("actions/arianeespaceniv2").price },
                { nom: "Blue Origin lvl 2", prix: client.get("actions/blueoriginniv1").price },
                { nom: "Blue Origin lvl 2", prix: client.get("actions/blueoriginniv2").price },
                { nom: "SpaceX lvl 2", prix: client.get("actions/spacexniv1").price },
                { nom: "SpaceX lvl 2", prix: client.get("actions/spacexniv2").price },
            ] },
            { nom: "🛰️ Stations", levels: [
                { nom: "Station Spatiale Chinoise", prix: client.get("recherches/css").price },
                { nom: "Station Spatiale Internationnale", prix: client.get("recherches/iss").price },
                { nom: "Gateway", prix: client.get("recherches/gateway").price }
            ]},
            { nom: "🛢️ Usine d'ergol", levels: [
                { nom: "Niveau 1", prix: client.get("ergols/usineergol1").price },
                { nom: "Niveau 2", prix: client.get("ergols/usineergol2").price },
                { nom: "Niveau 3", prix: client.get("ergols/usineergol3").price },
            ]},
            { nom: "Rejoindre la Conquête spatiale", prix: client.get("market/guerrefroide").price },
            { nom: "Sabotage d'une fusée", prix: client.get("market/sabotage").price },
            { nom: "Réparation d'une fusée", prix: client.get("market/reparage").price, pds: client.get("market/reparage").pds },
            { nom: "Charge utile de fusée", levels: [
                { nom: "Tiers 1", prix: client.get("rockets/t1").payload },
                { nom: "Tiers 2", prix: client.get("rockets/t2").payload },
                { nom: "Tiers 3", prix: client.get("rockets/t3").payload },
                { nom: "Tiers 4", prix: client.get("rockets/t4").payload },
                { nom: "Tiers 5", prix: client.get("rockets/t5").payload },
                { nom: "Tiers 6", prix: client.get("rockets/t6").payload },
            ]}
        ];

        let content = []
        items.forEach(item => {
            let desc = "";

            if(item.levels != undefined) {
                item.levels.forEach(level => {
                    desc = desc + `${level.nom} - ${level.prix}$ 
                    ${level.pds != undefined ?  'et ' + level.pds + ' points de science' : ''}`
                });
            }else{
                desc = item.prix + "$"
                    + (item.pds != undefined ? ` et ${item.pds} points de science` : "")
            }
            
            content.push({ name: item.nom, content: desc })
        });
        return new EmbedMessage(client, {
            title: "**Market**",
            content,
            thumbnail: true,
            author: message.author.username
        })
    }
}
