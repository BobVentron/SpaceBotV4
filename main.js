const fs = require("fs");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const config = require("./config");
const EmbedMessage = require("./util/EmbedMessage");
const { updateMeteoAuto } = require("./managers/MeteoManager");
const Ravitaillement = require("./models/ravitaillement");
const RavitaillementManager = require("./managers/RavitaillementManager");
const ChrismasCalendarManager = require("./managers/ChristmasCalendarManager");
const RavitaillementEvent = require("./util/RavitaillementEvent");
const PopEvent = require("./util/PopEvent");
const cron = require('node-cron');
const InfosProvider = require("./util/InfosProvider");

// cron.schedule('1 0 * * *', async () => {
//     await ChrismasCalendarManager.startNewCalendarDay();
//     console.log('running new Christmas calendar day ...');
// });

const intents = [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]

const bot = new Discord.Client({ intents: intents })
const guildId = config.environnements[config.env].GUILD_ID
const channelId = config.environnements[config.env].CHANNEL_ID
bot.SERVER_INFOS = {guildId, channelId}
bot.mongoose = require("./util/mongoose")
bot.commands = new Discord.Collection()
bot.commandsDisabled = []
global.staffRole = "Gestionnaire Space Bot"
global.botStarted = false
global.infosProvider = new InfosProvider();
bot.get = (key) => {
    return global.infosProvider.get(key);
};


loadCommands = (dir = "./commands") => {
    const commands = fs.readdirSync(`${dir}/`).filter(files => files.endsWith(".js"))

    for (const command of commands) {
        const file = require(`${dir}/${command}`)
        if (file.alias != undefined) {
            file.alias.forEach(element => {
                bot.commands.set(element, file)
            });
        }
        bot.commands.set(file.name, file)
    };
};

loadCommands();

setInterval(() => {
    if (botStarted) {
        let channel = bot.channels.cache.find(ch => ch.id === channelId)
        channel.send("**Vous avez besoin d'aide ? Contactez le staff dans `#besoin-aide` 😉**")
    }
}, (1000 * 60) * 60)

setInterval(async () => {
    if (botStarted) {
        await updateMeteoAuto().then(() => {
            let channel = bot.channels.cache.find(ch => ch.id === channelId);
            channel.send("**La météo a été mise à jour !**");
        })
    }
}, ((1000 * 60) * 60) * 4)

bot.on('ready', async () => {
    bot.user.setActivity("explorer l'Espace");
    console.log(`${bot.user.tag} has been connected sucessfully!`);
    global.botStarted = true
    for (const command of bot.commands) {
        if (command.admin != true && command[1].options != undefined) {
            bot.api.applications(bot.user.id).guilds(guildId).commands.post({
                data: {
                    name: command[1].name,
                    description: command[1].description.substring(0, 97) + "...",
                    options: command[1].options
                }
            })
            console.log(command[1].name + " slash command has been posted !")
        }
    }
    RavitaillementManager.stopAllRavitaillements()
    RavitaillementEvent.initializeEvent(bot);
    //PopEvent.init(bot)
});

bot.on('interactionCreate', async interaction => {
    const command = interaction.commandName.toLocaleLowerCase()
    const args = interaction.options._hoistedOptions

    if (interaction.channelId != channelId) return

    const channel = bot.channels.cache.find(c => c.id == interaction.channelId)
    const guild = bot.guilds.cache.get(interaction.guildId)
    let message = null
    await guild.members.fetch().then(members => {
        let member = members.get(interaction.member.user.id)
        if (args != undefined && args.find(a => a.type == "USER") != null) {
            const mention_id = args.find(arg => arg.type == "USER").value
            message = {
                guild: guild,
                channel: channel,
                member: member,
                author: member.user,
                mention: members.get(mention_id).user,
                interaction
            }
        } else {
            message = { guild: guild, channel: channel, member: member, author: member.user, interaction }
        }
    }).catch(err => { console.error(err) })

    if (bot.commandsDisabled.includes(command)) {
        interaction.reply({ embeds: [EmbedMessage.showError(bot, "**Spacebot - Erreur**", `La commande **${command}** est actuellement désactivée, veuillez réessayer ultérieurement ...`)] })
        return
    }

    const newArgs = args != undefined ? args.map(el => el.value) : []
    const result = await bot.commands.get(command).execute(bot, message, newArgs);

    interaction.reply({
        embeds: [result]
    })
})

bot.on('messageCreate', msg => {

    if (!msg.content.startsWith(config.environnements[config.env].PREFIX)) return;

    const args = msg.content.slice(config.environnements[config.env].PREFIX.length).split(' ');
    const command = args.shift().toLocaleLowerCase();

    if (!bot.commands.has(command)) return;
    if (bot.commandsDisabled.includes(command)) {
        msg.channel.send(EmbedMessage.showError(
            bot,
            "**Spacebot - Erreur**",
            `La commande **${command}** est actuellement désactivé, veuillez réessayer ultérieurement ...`
        ))
        return;
    }
    bot.commands.get(command).execute(bot, msg, args);
});

bot.mongoose.init();
bot.login(config.environnements[config.env].TOKEN);
