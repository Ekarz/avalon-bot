const state = require('./state');
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
    state.phase = 'TEAM_BUILDING'
};

exports.startVotes = (playerTags) => {
    state.channel.send(`Everyone, please *Accept* or *Reject* this team.`);
    state.phase = 'VOTES';
};

exports.handleVoteResults = () => {

};

const isLastAttempt = () => (state.quest === 1 && state.attempts === 2)
    || (state.attempts === state.players.filter(player => player.isEvil) + 1);
