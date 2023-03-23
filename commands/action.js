const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
    name: "action",
    use: "**/action [arianeespace  niveau 1/ blueorigin niveau 1/ spacex niveau 1 / arianeespace  niveau 2/ blueorigin niveau 2/ spacex niveau 2(optionnel)]**",
    description: "Vous permet de récolter vos parts journalières ou d'acheter de nouvelles parts dans une compagnies ci-dessus.",
    options: [
        {
            name: "entreprise",
            description: "Nom de l'entreprise dans laquelle vous achetez une action",
            type: 3,
            choices: [
                { name: "SpaceX niveau 1", value: "spacexniv1" },
                { name: "Blue Origin niveau 1", value: "blueoriginniv1" },
                { name: "Ariane Espace niveau 1", value: "arianeespaceniv1" },
                { name: "SpaceX niveau 2", value: "spacexniv2" },
                { name: "Blue Origin niveau 2", value: "blueoriginniv2" },
                { name: "Ariane Espace niveau 2", value: "arianeespaceniv2" },
            ],
            required: false
        }
    ],
    admin: false,
    async execute (client, message, args) {
        const time = new Date().getTime()
        if (await AgenceManager.targetExists(message.author.id)) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            if (args.length == 0) {
                if (data.spacexniv1 === 0 && data.spacexniv2 === 0 && data.blueoriginniv1 === 0 && data.blueoriginniv2 === 0 && data.arianeespaceniv1 === 0 && data.arianeespaceniv2 === 0) {
                    return new EmbedMessage(client, {
                        title: "**Part:**",
                        description: "Vous n'avez aucune part dans une entreprise.",
                        author: message.author.username
                    })
                } else {
                    if (time - data.lastpart < 28800000) {
                        let reainingTime = data.lastpart - time + 28800000
                        let hours = Math.floor((reainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        let minutes = Math.floor((reainingTime % (1000 * 60 * 60)) / (1000 * 60));
                        let secondes = Math.floor((reainingTime % (1000 * 60)) / (1000));
                        return new EmbedMessage(client, {
                            title: "**Part:**",
                            description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir executer la commande de nouveau`,
                            author: message.author.username
                        })
                    } else {
                        let argentwin = 0;
                        let description = "";
                        if (data.spacexniv1 === 1) {
                            argentwin = argentwin + 2000;
                            description = description + "\nVous venez de recevoir vos part de SpaceX niveau 1."
                        };
                        if (data.blueoriginniv1 === 1) {
                            argentwin = argentwin + 750;
                            description = description + "\nVous venez de recevoir vos part de Blue Origin niveau 1."
                        };
                        if (data.arianeespaceniv1 === 1) {
                            argentwin = argentwin + 350;
                            description = description + "\nVous venez de recevoir vos part d'Ariane Espace niveau 1."
                        };
                        if (data.spacexniv2 === 1) {
                            argentwin = argentwin + 2000;
                            description = description + "\nVous venez de recevoir vos part de SpaceX niveau 2."
                        };
                        if (data.blueoriginniv2 === 1) {
                            argentwin = argentwin + 750;
                            description = description + "\nVous venez de recevoir vos part de Blue Origin niveau 2."
                        };
                        if (data.arianeespaceniv2 === 1) {
                            argentwin = argentwin + 350;
                            description = description + "\nVous venez de recevoir vos part d'Ariane Espace niveau 2."
                        };
                        cashUpdated = data.cash + argentwin
                        Agence.findOneAndUpdate({ userID: message.author.id },
                            { cash: cashUpdated, lastpart: time }).catch(err => { console.error(err) })
                        return EmbedMessage.showSuccess(
                            client,
                            "**Part:**",
                            description,
                            message.author
                        )
                    }
                }
            } else {
                let entrepriseName = '';
                let dataToUpdate = null;
                let partCost = null;
                let error = false;
                switch (args[0]) {
                    case "arianeespaceniv1":
                        entrepriseName = "Ariane Espace Niveau 1"
                        partCost = client.get("actions/arianeespaceniv1").price;
                        if (data.arianeespaceniv1 == 1) {
                            return this.alreadyHavePartError(client, message, entrepriseName)
                        } else {
                            if (data.cash < partCost) {
                                return this.notEnoughMoneyError(client, message)
                            } else {
                                dataToUpdate = { cash: data.cash - partCost, arianeespaceniv1: 1, experience: data.experience + 500 }
                            }
                        }
                        break;
                    case "blueoriginniv1":
                        entrepriseName = "Blue Origin Niveau 1"
                        partCost = client.get("actions/blueoriginniv1").price;
                        if (data.blueoriginniv1 == 1) {
                            return this.alreadyHavePartError(client, message, entrepriseName)
                        } else {
                            if (data.cash < partCost) {
                                return this.notEnoughMoneyError(client, message)
                            } else {
                                dataToUpdate = { cash: data.cash - partCost, blueoriginniv1: 1, experience: data.experience + 850 }
                            }
                        }
                        break;
                    case "spacexniv1":
                        entrepriseName = "SpaceX Niveau 1"
                        partCost = client.get("actions/spacexniv1").price;
                        if (data.spacexniv1 == 1) {
                            return this.alreadyHavePartError(client, message, entrepriseName)
                        } else {
                            if (data.cash < partCost) {
                                return this.notEnoughMoneyError(client, message)
                            } else {
                                dataToUpdate = { cash: data.cash - partCost, spacexniv1: 1, experience: data.experience + 1800 }
                            }
                        }
                        break;
                    case "arianeespaceniv2":
                        entrepriseName = "Ariane Espace Niveau 2"
                        partCost = client.get("actions/arianeespaceniv2").price;
                        if (data.arianeespaceniv2 == 1) {
                            return this.alreadyHavePartError(client, message, entrepriseName)
                        } else {
                            if (data.cash < partCost) {
                                return this.notEnoughMoneyError(client, message)
                            } else {
                                dataToUpdate = { cash: data.cash - partCost, arianeespaceniv2: 1, experience: data.experience + 500 }
                            }
                        }
                        break;
                    case "blueoriginniv2":
                        entrepriseName = "Blue Origin Niveau 2"
                        partCost = client.get("actions/blueoriginniv2").price;
                        if (data.blueoriginniv2 == 1) {
                            return this.alreadyHavePartError(client, message, entrepriseName)
                        } else {
                            if (data.cash < partCost) {
                                return this.notEnoughMoneyError(client, message)
                            } else {
                                dataToUpdate = { cash: data.cash - partCost, blueoriginniv2: 1, experience: data.experience + 850 }
                            }
                        }
                        break;
                    case "spacexniv2":
                        entrepriseName = "SpaceX Niveau 2"
                        partCost = client.get("actions/spacexniv2").price;
                        if (data.spacexniv2 == 1) {
                            return this.alreadyHavePartError(client, message, entrepriseName)
                        } else {
                            if (data.cash < partCost) {
                                return this.notEnoughMoneyError(client, message)
                            } else {
                                dataToUpdate = { cash: data.cash - partCost, spacexniv2: 1, experience: data.experience + 1800 }
                            }
                        }
                        break;
                }

                if (!error) {
                    Agence.findOneAndUpdate({ userID: message.author.id }, dataToUpdate).catch(err => { console.error(err) })

                    AgenceManager.evaluateLevel(data, client, message)

                    return EmbedMessage.showSuccess(
                        client,
                        "**Part:**",
                        `Bravo vous venez d'acheter des parts dans l'entreprise **${entrepriseName}**`,
                        message.author
                    )
                }
            }
        } else {
            return EmbedMessage.anyAgenceError(client, message.author)
        }
    },

    notEnoughMoneyError (client, message) {
        return new EmbedMessage(client, {
            title: "**Part:**",
            description: "Vous n'avez pas assez d'argent pour acheter celà !",
            author: message.author.username
        })
    },
    alreadyHavePartError (client, message, entrepriseName) {
        return new EmbedMessage(client, {
            title: "**Part:**",
            description: `Vous avez déjà acheté des parts dans l'entreprise **${entrepriseName}** !`,
            author: message.author.username
        })
    },
    technonotunlock (client, message, technologie) {
        return new EmbedMessage(client, {
            title: "**Part:**",
            description: `Vous n'avez pas débloqué la technologie nécessaire : **${technologie}**`,
            author: message.author.username
        })
    }
}