const state = require('../game/state');

exports.name = 'join';
exports.channelOnly = true;
exports.description = 'Prepare to join a new game';
exports.usage = '';
exports.execute = (message, args) => {
    if (0 < state.playerTags.length && state.playerTags.length < 10
        && !state.playerTags.map(p => p.id).includes(message.author.id)
        && !state.started) {
        state.playerTags.push(message.author);
        return message.react('👍');
    }

    message.react('🚫');
};
