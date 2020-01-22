const { shuffle } = require('../utils/arrays');
const { assassin, merlin, minion, servant } = require('./roles');

const roles = [merlin, servant, servant, assassin, minion];

exports.attributeRoles = playerNames => {
    const shuffled = shuffle(playerNames);

    return roles.map(role => role(shuffled.pop()));
};

exports.getKnowledgeMap = () => {

};
