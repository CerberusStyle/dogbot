require('dotenv').config();
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const botToken = process.env.BOTTOKEN;

client.login(botToken);

client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);

        client.guilds.cache.forEach(guild => {
           console.log(`Joined server: ${guild.name}`);
       });
});

const spammerAutoMod = require('./automod/spammers.js');
spammerAutoMod(client, Client, MessageEmbed)
