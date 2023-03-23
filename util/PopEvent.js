const AgenceManager = require("../managers/AgenceManager");
const EmbedMessage = require("./EmbedMessage");

module.exports = {
  init(bot){
    this.launchEvent(bot);
  },

  launchEvent(bot){
    const rewardInfos = {
      "money": { min: 1, max: 2000, unit: "€" },
      "ergol": { min: 1, max: 1000, unit: "tonnes d'ergol" },
      "pds": { min: 1, max: 500, unit: "points de science" },
      "xp": { min: 1, max: 750, unit: "XP" }
    }
    let rewardType = ["money", "ergol", "pds", "xp"]
    let rewardChoosen = rewardType[Math.floor(Math.random() * (rewardType.length - 1) + 0)]
    let amount = Math.floor(Math.random() * rewardInfos[rewardChoosen].max + rewardInfos[rewardChoosen].min)

    let channel = bot.channels.cache.find(ch => ch.id === bot.SERVER_INFOS.channelId);
    channel.send({
      embeds: [new EmbedMessage(bot, {
        title: "**Alerte - Pop**",
        description: `Le premier à réagir avec l'émoji 🎁 dans les 10 prochaines secondes gagne **${amount} ${rewardInfos[rewardChoosen].unit}** !`,
        thumbnail: true,
        color: '#f0e407'
      })]
    }).then(message => {

      const collector = message.createReactionCollector(
        (reaction, user) => reaction.emoji.name === '🎁' && !user.bot
      );

      collector.on('collect', (reaction) => {
        collector.stop();
      });

      // fires when the time limit or the max is reached
      collector.on('end', () => {
        let reactions = collector.collected.first();
        message.channel.send({
          embeds: [
            EmbedMessage.showSuccess(bot, "**Pop - Succès**",
              `Bravo à **${[...reactions.users.cache][0][1].username}** qui remporte **${amount} ${rewardInfos[rewardChoosen].unit}** !`,
              [...reactions.users.cache][0][1])
          ]
        })
        AgenceManager.claimPopReward([...reactions.users.cache][0][1].id, rewardChoosen, amount)
        message.delete();
      });
      setTimeout(() => {
        this.init(bot);
      }, 1000 * 60 * 60 * 8)
    })
  }
}