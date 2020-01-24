const state = require('../game/state');
const { handleVoteResults } = require('../game/manager');

exports.name = 'vote';
exports.dmOnly = true;
exports.description = 'Vote for the proposed team.';
exports.usage = '[accept | reject]';
exports.execute = (message, args) => {
    const vote = args[0];

    if (!state.started || state.phase !== 'VOTES'
        || (vote !== 'accept' && vote !== 'reject')
        || state.votes.map(Object.keys).flat().includes(message.author)) {
        return message.react('🚫');
    }

    message.react('👍');
    state.votes.push({ [message.author]: vote });
    state.channel.send(`${message.author} has voted.`);

    if (state.votes.length === state.players.length) {
        handleVoteResults();
    }
};
