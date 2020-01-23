const { shuffle } = require('../utils/arrays');
const { assassin, merlin, minion, servant } = require('./roles');

const roles = [merlin, servant, servant, assassin, minion];

exports.attributeRoles = playerNames => {
    const shuffled = shuffle(playerNames);

    return shuffle(roles.map(role => role(shuffled.pop())));
};

exports.getKnowledgeMap = players => players.reduce((map, player) => ({
    ...map,
    [player.name]: players.filter(player.knowledge)
                          .map(seenPlayer => seenPlayer.name)
}), {});
