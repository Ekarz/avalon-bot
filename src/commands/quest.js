const state = require('../game/state');
const { handleQuestResults } = require('../game/manager');

exports.name = 'quest';
exports.dmOnly = true;
exports.description = 'Make the quest you have been sent to Succeed or Fail';
exports.usage = '[success | fail]';
exports.execute = (message, args) => {
    const action = args[0].toLowerCase();

    if (!state.started || state.phase !== 'QUEST'
        || isIllegal(action, message.author.username)
        || !state.team.includes(message.author.id)
        || Object.keys(state.actions).includes(message.author.username)) {
        return message.react('🚫');
    }

    message.react('👍');
    state.actions[message.author.username] = action;
    state.channel.send(`${message.author.username} has participated.`);

    if (Object.keys(state.actions).length === state.team.length) {
        handleQuestResults();
    }
};

const isIllegal = (action, author) => {
    switch (action) {
        case 'success':
            return false;
        case 'fail':
            return !state.players.find(player => player.name === author).isEvil;
        default:
            return true;
    }
};
