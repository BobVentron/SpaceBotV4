const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
//const imagetechno = require("../imagetechno.json");

module.exports = {
    name: "techno",
    use: "**/techno**",
    description: "Vous permet de débloquer de nouvelle technologie.",
    options: [
        {
            name: "technologie",
            description: "Technologie que vous voulez développer!",
            type: 3,
            choices: [
                { name: "Tiers 1", value: "t1"},
                { name: "Tiers 2", value: "t2"},
                { name: "Tiers 3", value: "t3"},
                { name: "Tiers 4", value: "t4"},
                { name: "Tiers 5", value: "t5"},
                { name: "Tiers 6", value: "t6"},
                { name: "SpaceX niveau 1", value: "spacexn1" },
                { name: "SpaceX niveau 2", value: "spacexn2"},
                { name: "Blue Origin niveau 1", value: "blueoriginn1" },
                { name: "Blue Origin niveau 2", value: "blueoriginn2"},
                { name: "Ariane Espace niveau 1", value: "arianeespacen1" },
                { name: "Ariane Espace niveau 2", value: "arianeespacen2" },
                { name: "Usine a ergol niveau 1", value: "ergoln1"},
                { name: "Usine a ergol niveau 2", value: "ergoln2"},
                { name: "Usine a ergol niveau 3", value: "ergoln3"},
                { name: "Gateway", value: "gateway" },
                { name: "Station Spatiale Internationnale", value: "iss" },
                { name: "Station Spatiale Chinoise", value: "css" },
            ],
            required: false
        }
    ],
    admin: false,
    async execute (client, message, args) {
        if (await AgenceManager.targetExists(message.author.id)) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            if (args.length == 0) {
                let nbimage = `${data.tiersdebloquer}${data.actiondebloque}${data.ergolniv1deboquer}${data.ergolniv2deboquer}${data.ergolniv3deboquer}${data.cssdebloquer}${data.issdebloquer}${data.gatewaydebloquer}`;
                let imagetecnho = imagetechno["image"][nbimage]
                return new EmbedMessage(client, {
                    title: "**Technologie**",
                    description: `Voici votre arbre de technologie :`,
                    author: message.author.username,
                    image: imagetecnho
                  })            
	      }else{
                if(data.cash >= 2500){
                    let argument = args[0]
                    let debloquer = data.tiersdebloquer
                    let action = data.actiondebloque
                    if (argument === "t1"){
                        if(debloquer === 0){
                            return this.technodebloquertierfusse("Fusée de tiers 1",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "t2"){
                        if(debloquer === 1){
                            return this.technodebloquertierfusse("Fusée de tiers 2",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "t3"){
                        if(debloquer === 2){
                            return this.technodebloquertierfusse("Fusée de tiers 3",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "t4"){
                        if(debloquer === 3){
                            return this.technodebloquertierfusse("Fusée de tiers 4",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "t5"){
                        if(debloquer === 4){
                            return this.technodebloquertierfusse("Fusée de tiers 5",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "t6"){
                        if(debloquer === 5){
                            return this.technodebloquertierfusse("Fusée de tiers 6",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "spacexn1"){
                        if(debloquer >= 3 && action === 2){
                            return this.technodebloqueraction("action SpaceX de tiers 1",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "spacexn2"){
                        if(debloquer >= 6 && action === 5){
                            return this.technodebloqueraction("action SpaceX de tiers 2",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "blueoriginn1"){
                        if(debloquer >= 2 && action === 1){
                            return this.technodebloqueraction("action Blue Origin de tiers 1",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "blueoriginn2"){
                        if(debloquer >= 5 && action === 4){
                            return this.technodebloqueraction("action Blue Origin de tiers 2",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "arianeespacen1"){
                        if(debloquer >= 1){
                            return this.technodebloqueraction("action Ariane Espace de tiers 1",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "arianeespacen2"){
                        if(debloquer >= 4 && action === 3){
                            return this.technodebloqueraction("action Ariane Espace de tiers 2",client, message, data)
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "ergoln1"){
                        if(debloquer >= 4 && data.ergolniv1debloquer === 0){
                            Agence.findOneAndUpdate({ userID: message.author.id },
                                { ergolniv1debloquer: 1 }).catch(err => { console.error(err) })
                            return new EmbedMessage(client, {
                                title: "**Technologie**",
                                description: `Vous venez de débloquer la technologie : Usine a ergol de tiers 1`,
                                author: message.author.username
                            })
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "ergoln2"){
                        if(debloquer >= 5 && data.ergolniv2debloquer === 0){
                            Agence.findOneAndUpdate({ userID: message.author.id },
                                { ergolniv2debloquer: 1 }).catch(err => { console.error(err) })
                            return new EmbedMessage(client, {
                                title: "**Technologie**",
                                description: `Vous venez de débloquer la technologie : Usine a ergol de tiers 2`,
                                author: message.author.username
                            })
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "ergoln3"){
                        if(debloquer >= 6 && data.ergolniv3debloquer === 0){
                            Agence.findOneAndUpdate({ userID: message.author.id },
                                { ergolniv3debloquer: 1 }).catch(err => { console.error(err) })
                            return new EmbedMessage(client, {
                                title: "**Technologie**",
                                description: `Vous venez de débloquer la technologie : Usine a ergol de tiers 3`,
                                author: message.author.username
                            })
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "gateway"){
                        if(debloquer >= 6 && data.gatewaydebloquer === 0){
                            Agence.findOneAndUpdate({ userID: message.author.id },
                                { gatewaydebloquer: 1 }).catch(err => { console.error(err) })
                            return new EmbedMessage(client, {
                                title: "**Technologie**",
                                description: `Vous venez de débloquer la technologie : Gateway`,
                                author: message.author.username
                            })
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "iss"){
                        if(debloquer >= 4 && data.issdebloquer === 0){
                            Agence.findOneAndUpdate({ userID: message.author.id },
                                { issdebloquer: 1 }).catch(err => { console.error(err) })
                            return new EmbedMessage(client, {
                                title: "**Technologie**",
                                description: `Vous venez de débloquer la technologie : ISS`,
                                author: message.author.username
                            })
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else if(argument === "css"){
                        if(debloquer >= 2 && data.cssdebloquer === 0){
                            Agence.findOneAndUpdate({ userID: message.author.id },
                                { cssdebloquer: 1 }).catch(err => { console.error(err) })
                            return new EmbedMessage(client, {
                                title: "**Technologie**",
                                description: `Vous venez de débloquer la technologie : CSS`,
                                author: message.author.username
                            })
                        }else{
                            return this.erreurtechno(client, message)
                        }
                    }else{

                    }
                }else{
                    return EmbedMessage.showError(client, "**Buy - Erreur**", `Vous n'avez pas de pas assez d'argent pour acheter cette technologie !`)
                }
            }
        }else {
            return EmbedMessage.anyAgenceError(client, message.author)
        }
    },

    technodebloquertierfusse(technologie, client, message, data){
        let update = data.tiersdebloquer + 1
        Agence.findOneAndUpdate({ userID: message.author.id },
            { tiersdebloquer: update, cash: data.cash - 2500}).catch(err => { console.error(err) })
        return new EmbedMessage(client, {
            title: "**Technologie**",
            description: `Vous venez de débloquer la technologie : **${technologie}**`,
            author: message.author.username
          })
    },

    technodebloqueraction(technologie, client, message, data){
        let update = data.actiondebloque + 1
        Agence.findOneAndUpdate({ userID: message.author.id },
            { actiondebloque: update, cash: data.cash - 2500}).catch(err => { console.error(err) })
        return new EmbedMessage(client, {
            title: "**Technologie**",
            description: `Vous venez de débloquer la technologie : **${technologie}**`,
            author: message.author.username
          })
    },

    erreurtechno(client, message){
        return new EmbedMessage(client, {
            title: "**Technologie**",
            description: `Vous avez pas débloqué(e) les technologies nécessaires pour debloquer celle-ci ou vous l'avez déjà débloqué !`,
            author: message.author.username
          })
    }
}