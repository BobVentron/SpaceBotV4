const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const PasDeTir = require("../models/pasdetir");
const mongoose = require("mongoose");

module.exports = {
  name: "updatedata",
  use: "/updatedata",
  description: "Met à jour les données des joueurs pour la v3",
  admin: true,
  async execute (client, message, args) {
    if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
      let data = await Agence.find({}).then(data => { return data }).catch(err => { console.error(err) })
      for (const agence of data) {

        let dataToUpdate = []
        dataToUpdate["bank"] = 1000
        dataToUpdate["ergol"] = 0
        dataToUpdate["cash"] = 0
        dataToUpdate["science"] = 0
        dataToUpdate["level"] = 0
        dataToUpdate["experience"] = 0
        dataToUpdate["Launch"] = 0
        dataToUpdate["Launch"] = 0
        dataToUpdate["workmin"] = 25
        dataToUpdate["workmax"] = 400
        dataToUpdate["enbourse"] = 0
        dataToUpdate["bourse1"] = 0
        dataToUpdate["bourse2"] = 0
        dataToUpdate["bourse3"] = 0
        dataToUpdate["usineErgol1"] = 0
        dataToUpdate["usineErgol2"] = 0
        dataToUpdate["usineErgol3"] = 0
        dataToUpdate["css"] = 0
        dataToUpdate["iss"] = 0
        dataToUpdate["gateway"] = 0
        dataToUpdate["spacexniv1"] = 0
        dataToUpdate["spacexniv2"] = 0
        dataToUpdate["blueoriginniv1"] = 0
        dataToUpdate["blueoriginniv2"] = 0
        dataToUpdate["arianeespaceniv1"] = 0
        dataToUpdate["arianeespaceniv2"] = 0
        dataToUpdate["RussieJoin"] = 0
        dataToUpdate["USAJoin"] = 0
        dataToUpdate["lastWork"] = 0
        dataToUpdate["lastSteal"] = 0
        dataToUpdate["lastLaunchReusable"] = 0
        dataToUpdate["lastbourse"] = 0
        dataToUpdate["lastpart"] = 0
        dataToUpdate["lastRecherche"] = 0
        dataToUpdate["lastErgol"] = 0

        Agence.findOneAndUpdate({ userID: agence.userID }, Object.assign({}, dataToUpdate)).then(() => {
          // PAS DE TIR ALEATOIRE
          const data = [
            { id: 1, name: "USA" },
            { id: 2, name: "Russie" },
            { id: 3, name: "Chine" },
            { id: 4, name: "Guyane" }
          ];
          const randomIndex = Math.floor(Math.random() * (data.length - 0) + 0);

          let pdtId = mongoose.Types.ObjectId()
          const tmp = {
            name: 'Pas de tir ' + new String(pdtId).substring(new String(pdtId).length - 4, new String(pdtId).length),
            location: data[randomIndex].name,
            userID: agence.userID
          }
          const _merged = Object.assign({ _id: pdtId }, tmp);
          const pasDeTir = new PasDeTir(_merged);
          pasDeTir.save();
          message.channel.send({
            embeds: [
              EmbedMessage.showSuccess(client, "**Update - Succès**", `L'agence ${agence.agenceName} a été mise à jour avec succès et a reçu un pas de tir en ${data[randomIndex].name} !`, message.author)
            ]
          });
        }).catch(err => console.error(err));
      }
      message.channel.send({embeds: [
        EmbedMessage.showSuccess(
        client,
        "**Update - Succès**",
        "Toutes les agences ont été modifiées !",
        message.author
      )]})
    } else {
      message.channel.send({embeds: [
        EmbedMessage.showError(
          client,
          "🛑 Erreur",
          "Vous n'avez pas la permission d'executer cette commande !"
        )
      ]});
    }
  }
}