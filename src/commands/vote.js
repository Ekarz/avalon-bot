const state = require('../game/state');
const { handleVoteResults } = require('../game/manager');

exports.name = 'vote';
exports.dmOnly = true;
exports.description = 'Vote for the proposed team.';
exports.usage = '[accept | reject]';
exports.execute = (message, args) => {
    const vote = args[0].toLowerCase();

    if (!state.started || state.phase !== 'VOTES'
        || (vote !== 'accept' && vote !== 'reject')
        || !state.playerTags.map(p => p.id).includes(message.author.id)
        || Object.keys(state.votes).includes(message.author.username)) {
        return message.react('🚫');
    }

    message.react('👍');
    state.votes[message.author.username] = vote;
    state.channel.send(`${message.author.username} has voted.`);

    if (Object.keys(state.votes).length === state.players.length) {
        handleVoteResults();
    }
};
