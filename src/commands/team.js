const state = require('../game/state');
const { questPlayersMatrix, startVotes } = require('../game/manager');

exports.name = 'team';
exports.channelOnly = true;
exports.description = 'Put forward a team to send to a quest';
exports.usage = '[@Person1] [@Person2] [@Person3] ...';
exports.execute = (message, args) => {
    if (!state.started || state.phase !== 'TEAM_BUILDING'
        || args.length !== questPlayersMatrix[state.quest - 1][state.players.length - 5]
        || !(args.filter(name => state.playerTags.includes(name)).length === args.length)) {
        return message.react('🚫');
    }

    message.react('👍');
    state.team = args;
    startVotes();
};
