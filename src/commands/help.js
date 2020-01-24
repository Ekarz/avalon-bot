const { prefix } = require('../config.json');

exports.name = 'help';
exports.dmOnly = true;
exports.description = 'List all commands and their description.';
exports.usage = '[command name]';
exports.execute = (message, args) => {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
        data.push('Available commands :');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`For more info, use \`${prefix}help [command name]\`.`);

        return message.author.send(data, { split: true });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
        return message.reply('This command does not exist.');
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

    message.author.send(data, { split: true });
};
