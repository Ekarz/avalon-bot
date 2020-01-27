const state = require('../game/state');

exports.name = 'host';
exports.channelOnly = true;
exports.description = 'Host a new game';
exports.usage = '';
exports.execute = (message, args) => {
    if (state.playerTags.length) {
        return message.react('🚫');
    }

    state.playerTags.push(message.author);
    state.host = message.author.id;
    message.react('👍');
};
