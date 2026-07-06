const invlink = process.env.INVLINK;
const LoggingChannelID = process.env.LOGCHAN;
const spammerlist = require('../system/spammerlist.json');
const ocrlist = require('../system/ocrlist.json');
const Tesseract = require('tesseract.js')

module.exports = (client, Client, MessageEmbed) => {
    client.on('messageCreate', async (message) => {

       const user = message.author.id;

        if (message.author.id === client.id) {
            return;
        }

        const logsChannel = client.channels.cache.get(LoggingChannelID);
        const guild = client.guilds.cache.get(message.guildId);

        async function spPunishment(userID, message) {
            const target = guild.members.cache.get(userID)

            const member = message.guild.members.cache.get(message.author.id);

          if (member && member.roles.highest.position > message.guild.members.me.roles.highest.position) {
             console.log("Cannot delete message from a moderator.");
             return;
           }

            console.log("Spammer AutoMod MSG/DM");
            message.delete()


            if (!user) {
                return;
            }

            target.ban(0, "Spammer AutoMod - Text")

            const spEmbed = new MessageEmbed()
                .setTitle("Member Banned:")
                .addFields(
                    { name: "**" + "Username:" + "**", value: target.user.tag, inline: false },
                    { name: "**" + "Account ID" + "**", value: target.user.id, inline: false },
                    { name: "**" + "Reason" + "**", value: `Spammer (Text)`, inline: false },
                    { name: "**" + "Banned On:" + "**", value: new Date().toLocaleDateString() + " @ " + new Date().toLocaleTimeString(), inline: false },
                    { name: "**" + "Banned By:" + "**", value: client.user.tag, inline: false },
                )
                .setColor("#ff0d00")
            logsChannel.send({ embeds: [spEmbed] })
        }

        async function ocrPunishment(userID, message) {
            const target = guild.members.cache.get(userID)

            const member = message.guild.members.cache.get(message.author.id);

          if (member && member.roles.highest.position > message.guild.members.me.roles.highest.position) {
             console.log("Cannot delete message from a moderator.");
             return;
           }

            console.log("Spammer AutoMod OCR");
            message.delete()

            if (!user) {
                return;
            }

             target.ban(0, "Spammer AutoMod - OCR")

            const ocrEmbed = new MessageEmbed()
                .setTitle("Member Banned:")
                .addFields(
                    { name: "**" + "Username:" + "**", value: target.user.tag, inline: false },
                    { name: "**" + "Account ID" + "**", value: target.user.id, inline: false },
                    { name: "**" + "Reason" + "**", value: `Spammer (OCR)`, inline: false },
                    { name: "**" + "Banned On:" + "**", value: new Date().toLocaleDateString() + " @ " + new Date().toLocaleTimeString(), inline: false },
                    { name: "**" + "Banned By:" + "**", value: client.user.tag, inline: false },
                )
                .setColor("#ff0d00")
            logsChannel.send({ embeds: [ocrEmbed] })
       }


const content = message.content.toLowerCase();

if (spammerlist.some(term => content.includes(term.toLowerCase()))) {
    spPunishment(message.author.id, message);
} else if (message.attachments.size > 0) {
    message.attachments.forEach((attachment) => {
        const imageURL = attachment.proxyURL;

        Tesseract.recognize(imageURL, "eng")
            .then(({ data: { text } }) => {

                const cleanedText = text
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    .trim();

                const found = ocrlist.some(word =>
                    cleanedText.includes(word.toLowerCase())
                );

                if (found) {
                    ocrPunishment(message.author.id, message);
                }
            })
            .catch(console.error);
    });
} else {
            return;
        }
    })
}
