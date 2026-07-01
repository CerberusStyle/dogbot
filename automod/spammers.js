const invlink = process.env.INVLINK;
const LoggingChannelID = process.env.LOGCHAN;
const spammerlist = require('../settings/spammerlist.json');
const ocrlist =  require('../settings/ocrlist.json');


module.exports = (client, Client, MessageEmbed) => {
    client.on('messageCreate', async (message) => {
        console.log(message)

       const user = message.author.id;

       if (!user.manageable || !user.moderatable) {
           return;
        }

        if (message.author.id === client.id) { //ignore spam through the bot - prevents the bot tr>
            return;
        }

        const logsChannel = client.channels.cache.get(LoggingChannelID);
        const guild = client.guilds.cache.get(message.guildId);

        async function spPunishment(userID, message) {
            const target = guild.members.cache.get(userID)

            message.delete()

            if (!user) {
                return;
            }

          // target.ban(0, "Spammer AutoMod - Text")

            const spEmbed = new MessageEmbed()
                .setTitle("Member Banned:")
                .addFields(
                    { name: "**" + "Username:" + "**", value: target.user.tag, inline: false },
                    { name: "**" + "Account ID" + "**", value: target.user.id, inline: false },
                    { name: "**" + "Reason" + "**", value: `Spammer (Text)`, inline: false },
                    { name: "**" + "Banned On:" + "**", value: new Date().toLocaleDateString() + ">
                    { name: "**" + "Banned By:" + "**", value: client.user.tag, inline: false },
                )
                .setColor("#ff0d00")
            logsChannel.send({ embeds: [spEmbed] })
        }

        async function ocrPunishment(userID, message) {
            const target = guild.members.cache.get(userID)

            message.delete()

            //target.ban(0, "Spammer AutoMod - OCR")

            const ocrEmbed = new MessageEmbed()
                .setTitle("Member Banned:")
                .addFields(
                    { name: "**" + "Username:" + "**", value: target.user.tag, inline: false },
                    { name: "**" + "Account ID" + "**", value: target.user.id, inline: false },
                    { name: "**" + "Reason" + "**", value: `Spammer (OCR)`, inline: false },
                    { name: "**" + "Banned On:" + "**", value: new Date().toLocaleDateString() + ">
                    { name: "**" + "Banned By:" + "**", value: client.user.tag, inline: false },
                )
                .setColor("#ff0d00")
            logsChannel.send({ embeds: [ocrEmbed] })
        }

        async function invPunishment(userID, message) {
            const target = guild.members.cache.get(userID)

            message.delete()

            if (!user) {
                return;
            }

            const invEmbed = new MessageEmbed()
                .setTitle("Message Deleted:")
                .addFields(
                    { name: "**" + "Username:" + "**", value: target.user.tag, inline: false },
                    { name: "**" + "Account ID" + "**", value: target.user.id, inline: false },
                    { name: "**" + "Reason" + "**", value: `Discord Invite Link`, inline: false },
                    { name: "**" + "Deleted On:" + "**", value: new Date().toLocaleDateString() + >
                )
                .setColor("#ff0d00")
            logsChannel.send({ embeds: [invEmbed] })
        }

        if (spammerlist.includes(message.content)) {
            console.log("Spammer AutoMod Text")
            spPunishment(message.author.id, message)
        } else if (ocrlist.includes(message.content)) {
            console.log("Spammer AutoMod OCR")
            ocrPunishment(message.author.id, message)
        } else if (invlink.includes(message.content)) {
            console.log("Spammer AutoMod Invite")
            invPunishment(message.author.id, message)
        } else {
            return;
        }
    })
}

