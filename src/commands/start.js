const state = require('../game/state');

exports.name = 'start';
exports.channelOnly = true;
exports.description = 'Start the game';
exports.usage = '';
exports.execute = (message, args) => {
    if (state.playerTags.length < 5 || message.author !== state.host) {
        return message.react('🚫');
    }

    state.started = true;
    message.react('👍');
};
