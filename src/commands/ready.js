const { prefix } = require('../config.json');
const { playerTags } = require('./host');

exports.name = 'join';
exports.channelOnly = true;
exports.description = 'Prepare to join a new game';
exports.usage = '';
exports.execute = (message, args) => {
    if (0 < playerTags.length && playerTags.length < 10 && !playerTags.includes(message.author)) {
        playerTags.push(message.author);
    }

    message.react(playerTags.includes(message.author) ? '👍' : '🚫');
};
