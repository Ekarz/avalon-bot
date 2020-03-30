const state = require('./state');
const { shuffle } = require('../utils/arrays');
const { getKnowledgeMap } = require('./roleAttribution');
const { attributeRoles } = require('./roleAttribution');

const questPlayersMatrix = [
    [2, 2, 2, 3, 3, 3],
    [3, 3, 3, 4, 4, 4],
    [2, 4, 3, 4, 4, 4],
    [3, 3, 4, 5, 5, 5],
    [3, 4, 4, 5, 5, 4]
];
exports.questPlayersMatrix = questPlayersMatrix;

exports.startGame = () => {
    state.channel.send('Attributing roles to players...');
    state.players = attributeRoles(state.playerTags.map(p => p.username));

    sendInformationToPlayers();

    startQuest();
};

const sendInformationToPlayers = () => {
    const map = getKnowledgeMap(state.players);

    Object.entries(map).forEach(([playerName, seenPlayerNames]) => {
        const player = state.players.find(p => p.name === playerName);
        const user = state.channel.members.get(state.playerTags.find(p => p.username === playerName).id);

        user.send(`${player.description} ${seenPlayerNames.map(name => `**${name}**`)}`);
    });
};

const startQuest = () => {
    state.quest++;

    startTeamBuilding();
};

const startTeamBuilding = () => {
    state.attempts++;
    state.channel.send(`**Quest ${state.quest} - Attempt ${state.attempts}/${maxAttempts()}**`);

    if (state.results.length) {
        state.channel.send(`Quests recap : ${state.results.map(str => `**${str}**`)}`);
    }

    const leader = state.playerTags[++state.leaderIndex % state.playerTags.length];
    state.channel.send(`${leader}, please put forward ${questPlayersMatrix[state.quest - 1][state.players.length - 5]} people to send to a Quest.`);

    if (needsDoubleFail()) {
        state.channel.send(`**Please note that this quest needs 2 Fails to fail.**`);
    }

    state.phase = 'TEAM_BUILDING';
};

const maxAttempts = () => state.quest === 1 ? 2 : state.players.filter(player => player.isEvil).length + 1;

exports.startVotes = () => {
    state.votes = {};
    if (state.attempts === maxAttempts()) {
        state.channel.send('This is the last proposal for this quest and as such it cannot be rejected.');
        startQuestActions();
    } else {
        state.channel.send(`Everyone, please **Accept** or **Reject** this team.`);
        state.phase = 'VOTES';
    }
};

exports.handleVoteResults = () => {
    const stringData = [];
    stringData.push('Here are the results :');

    for (const [playerName, vote] of Object.entries(state.votes)) {
        stringData.push(`**${vote === 'accept' ? '✅' : '🛑'} ${playerName}** voted **${vote}**`);
    }

    state.channel.send(stringData.join('\n'));

    if (isRejected(Object.values(state.votes))) {
        state.channel.send('That team has been rejected. Moving on to the next leader.');
        startTeamBuilding();
    } else {
        startQuestActions();
    }
};

const isRejected = votes => {
    const counter = { accept: 0, reject: 0 };
    votes.forEach(vote => counter[vote]++);

    return counter.reject >= Math.ceil(votes.length / 2);
};

const startQuestActions = () => {
    state.attempts = 0;
    state.actions = {};
    state.channel.send(`${state.team.map(id => `<@!${id}>`)} have been chosen to go in a Quest ! They can make it **Succeed** or **Fail**`);
    state.phase = 'QUEST';
};

exports.handleQuestResults = () => {
    const results = shuffle(Object.values(state.actions));

    state.channel.send(`The results are : ${results.map(str => `**${str === 'fail' ? '💥' : '🏆'}**`)}`);

    if (isFailed(results)) {
        state.channel.send(`The quest has **failed**...`);
        state.results.push('FAIL');
    } else {
        state.channel.send(`The quest has **succeeded** !`);
        state.results.push('SUCCESS');
    }

    handleEndOfQuest();
};

const isFailed = results => results.filter(result => result === 'fail').length >= (needsDoubleFail() ? 2 : 1);
const needsDoubleFail = () => state.players.length >= 7 && state.quest === 4;

const handleEndOfQuest = () => {
    if (state.results.filter(res => res === 'FAIL').length >= 3) {
        state.channel.send(`Evil wins !`);
        state.endGame();
    } else if (state.results.filter(res => res === 'SUCCESS').length >= 3) {
        state.channel.send(`Good wins ! 
        ${state.playerTags.find(p => p.username === state.players.find(player => player.role === 'Assassin').name)}, as the Assassin, who do you **kill** ?`);
        state.phase = 'ASSASSIN';
    } else {
        startQuest();
    }
};

exports.kill = playerTag => {
    const stringData = [];
    const merlinsName = state.players.find(player => player.role === 'Merlin').name;

    stringData.push(`Merlin was ${merlinsName} !`);
    stringData.push(playerTag === merlinsName ? 'Evil wins !' : 'Good wins !');
    state.channel.send(stringData.join('\n'));

    state.endGame();
};
