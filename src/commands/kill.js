const state = require('../game/state');
const { kill } = require('../game/manager');

exports.name = 'kill';
exports.channelOnly = true;
exports.description = 'Try to kill Merlin if you are the Assassin';
exports.usage = '[@Person]';
exports.execute = (message, args) => {
    const playerTag = args[0];

    if (!state.started || state.phase !== 'ASSASSIN'
        || state.players.find(player => player.name === message.author).role !== 'Assassin'
        || !state.playerTags.includes(playerTag)) {
        return message.react('🚫');
    }

    message.react('👍');
    kill(playerTag);
};
