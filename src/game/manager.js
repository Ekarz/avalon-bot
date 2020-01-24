const state = require('./state');
const { shuffle } = require('../utils/arrays');
const { getKnowledgeMap } = require('./roleAttribution');
const { attributeRoles } = require('./roleAttribution');

exports.questPlayersMatrix = [
    [2, 2, 2, 3, 3, 3],
    [3, 3, 3, 4, 4, 4],
    [2, 4, 3, 4, 4, 4],
    [3, 3, 4, 5, 5, 5],
    [3, 4, 4, 5, 5, 4]
];

exports.startGame = () => {
    state.channel.send('Attributing roles to players...');
    state.players = attributeRoles(state.playerTags);

    sendInformationToPlayers();

    startQuest();
};

const sendInformationToPlayers = () => {
    const map = getKnowledgeMap(state.players);

    Object.entries(map).forEach(([playerName, seenPlayerNames]) => {
        const player = state.players.find(p => p.name === playerName);
        playerName.send(`${player.description} ${seenPlayerNames}`);
    });
};

const startQuest = () => {
    state.quest++;

    startTeamBuilding();
};

const startTeamBuilding = () => {
    state.attempts++;

    const leader = state.players[state.leaderIndex++ % state.players.length];
    state.channel.send(`<@${leader}>, please put forward ${questPlayersMatrix[state.quest - 1][state.players.length - 5]} people to send to a Quest.`);
    state.phase = 'TEAM_BUILDING';
};

exports.startVotes = () => {
    if (isLastAttempt()) {
        state.channel.send('This is the last proposal for this quest and as such it cannot be rejected.');
        startQuestActions();
    } else {
        state.channel.send(`Everyone, please *Accept* or *Reject* this team.`);
        state.phase = 'VOTES';
    }
};

exports.handleVoteResults = () => {
    const stringData = [];
    stringData.push('Here are the results :');

    for (const [playerTag, vote] of state.votes.map(Object.entries).flat()) {
        stringData.push(`${playerTag} voted ${vote}`);
    }

    state.channel.send(stringData.join('\n'));

    if (isRejected(state.votes.map(Object.values).flat())) {
        state.channel.send('That team has been rejected. Moving on to the next leader.');
        startTeamBuilding();
    } else {
        startQuestActions();
    }
};

const isRejected = votes => {
    const counter = { accept: 0, reject: 0 };
    votes.forEach(vote => counter[vote]++);

    return counter.reject >= Math.floor(votes.length / 2);
};

const startQuestActions = () => {
    state.attempts = 0;
    state.channel.send(`${state.team} have been chosen to go in a Quest ! They can make it *Succeed* or *Fail*`);
    state.phase = 'QUEST';
};

exports.handleQuestResults = () => {
    const results = shuffle(state.actions.map(Object.values).flat());

    state.channel.send(`The results are : ${results}`);

    if (isFailed(results)) {
        state.channel.send(`The quest has failed...`);
        state.results.push('FAIL');
    } else {
        state.channel.send(`The quest has succeeded !`);
        state.results.push('SUCCESS');
    }

    handleEndOfQuest();
};

const isFailed = results => results.filter(result => result === 'fail').length >= 1;

const handleEndOfQuest = () => {
    if (state.results.filter(res => res === 'FAIL').length >= 3) {
        state.channel.send(`Evil wins !`);
        state.endGame();
    } else if (state.results.filter(res => res === 'SUCCESS').length >= 3) {
        state.channel.send(`Good wins ! 
        ${state.players.find(player => player.role === 'Assassin').name}, as the Assassin, who do you *kill* ?`);
        state.phase = 'ASSASSIN';
    } else {
        startQuest();
    }
};

const isLastAttempt = () => (state.quest === 1 && state.attempts === 2)
    || (state.attempts === state.players.filter(player => player.isEvil) + 1);
