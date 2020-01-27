const state = require('../game/state');
const { questPlayersMatrix, startVotes } = require('../game/manager');

exports.name = 'team';
exports.channelOnly = true;
exports.description = 'Put forward a team to send to a quest';
exports.usage = '[@Person1] [@Person2] [@Person3] ...';
exports.execute = (message, args) => {
    const userIds = [... new Set(args.map(str => str.match(/\d/g).join('')))];

    if (!state.started || state.phase !== 'TEAM_BUILDING'
        || state.playerTags.map(p => p.id)[state.leaderIndex % state.playerTags.length] !== message.author.id
        || userIds.length !== questPlayersMatrix[state.quest - 1][state.playerTags.length - 5]
        || !(userIds.filter(name => state.playerTags.map(p => p.id).includes(name)).length === userIds.length)) {
        return message.react('🚫');
    }

    message.react('👍');
    state.team = userIds;
    startVotes();
};
