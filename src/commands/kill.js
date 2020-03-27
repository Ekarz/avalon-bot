const state = require('../game/state');
const { kill } = require('../game/manager');

exports.name = 'kill';
exports.channelOnly = true;
exports.description = 'Try to kill Merlin if you are the Assassin';
exports.usage = '[@Person]';
exports.execute = (message, args) => {
    const playerId = args[0].match(/\d/g).join('');
    const playerTag = state.playerTags.find(p => p.id === playerId);

    if (!state.started || state.phase !== 'ASSASSIN'
        || state.players.find(player => player.name === message.author.username).role !== 'Assassin'
        || playerTag === undefined
        || state.players.find(p => p.name === playerTag.username).isEvil
        || !state.playerTags.map(p => p.id).includes(playerId)) {
        return message.react('🚫');
    }

    message.react('👍');
    kill(playerTag.username);
};
