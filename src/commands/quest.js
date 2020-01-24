const state = require('../game/state');
const { handleQuestResults } = require('../game/manager');

exports.name = 'quest';
exports.dmOnly = true;
exports.description = 'Make the quest you have been sent to Succeed or Fail';
exports.usage = '[success | fail]';
exports.execute = (message, args) => {
    const action = args[0].toLowerCase();

    if (!state.started || state.phase !== 'QUEST'
        || (action !== 'success' && action !== 'fail')
        || !state.team.includes(message.author)
        || state.actions.map(Object.keys).flat().includes(message.author)) {
        return message.react('🚫');
    }

    message.react('👍');
    state.actions.push({ [message.author]: action });
    state.channel.send(`${message.author} has participated.`);

    if (state.actions.length === state.team.length) {
        handleQuestResults();
    }
};
