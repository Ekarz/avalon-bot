const Discord = require('discord.js');
const fs = require('fs');
const { token, prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('src/commands')
                       .filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    if (command.channelOnly && message.channel.type !== 'text') {
        return message.reply('This command must be used in a channel.')
    }

    try {
        command.execute(message, args);
    } catch (e) {
        console.error(e);
    }
});

client.login(token);
