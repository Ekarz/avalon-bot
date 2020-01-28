const { shuffle } = require('../utils/arrays');
const { assassin, merlin, minion, servant, mordred, percival, morgana } = require('./roles');

const MIN_PLAYERS = 5;

const roles = [
    [merlin, servant, servant, assassin, minion],
    [merlin, servant, servant, servant, assassin, mordred],
    [merlin, servant, servant, percival, assassin, mordred, morgana]
];

exports.attributeRoles = playerNames => {
    const shuffled = shuffle(playerNames);

    return shuffle(roles[playerNames.length - MIN_PLAYERS].map(role => role(shuffled.pop())));
};

exports.getKnowledgeMap = players => players.reduce((map, player) => ({
    ...map,
    [player.name]: shuffle(players.filter(player.knowledge)
                                  .map(seenPlayer => seenPlayer.name))
}), {});
