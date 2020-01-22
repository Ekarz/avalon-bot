exports.servant = name => ({
    name,
    role: 'Loyal servant of Arthur',
    isEvil: false,
    knowledge: () => false
});

exports.merlin = name => ({
    name,
    role: 'Merlin',
    isEvil: false,
    knowledge: other => other.isEvil
});

exports.minion = name => ({
    name,
    role: 'Minion of Mordred',
    isEvil: true,
    knowledge: other => other.isEvil && other.name !== name
});

exports.assassin = name => ({
    name,
    role: 'Assassin',
    isEvil: true,
    knowledge: other => other.isEvil && other.name !== name
});
