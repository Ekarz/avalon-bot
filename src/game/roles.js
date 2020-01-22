const GOOD = 'good';
const EVIL = 'evil';

exports.servant = name => ({
    name,
    role: 'Loyal servant of Arthur',
    alignment: GOOD,
    knowledge: () => false
});

exports.merlin = name => ({
    name,
    role: 'Merlin',
    alignment: GOOD,
    knowledge: other => other.alignment === EVIL
});


const evilAttributes = {
    alignment: EVIL,
    knowledge: other => other.alignment === EVIL && other.name !== name
};

exports.minion = name => ({
    name,
    role: 'Minion of Mordred',
    ...evilAttributes
});

exports.assassin = name => ({
    name,
    role: 'Assassin',
    ...evilAttributes
});
