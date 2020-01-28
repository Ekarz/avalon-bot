exports.servant = name => ({
    name,
    role: 'Loyal servant of Arthur',
    description: `You are a **loyal servant of Arthur**. 
    You're working for **Good**. 
    Be careful ! You can't trust anyone.`,
    isEvil: false,
    knowledge: () => false
});

exports.merlin = name => ({
    name,
    role: 'Merlin',
    description: `You are **Merlin**. 
    You're working for **Good**. 
    Your magic allowed you to detect evil in the hearts of`,
    isEvil: false,
    knowledge: other => other.isEvil && other.role !== 'Mordred'
});

exports.minion = name => ({
    name,
    role: 'Minion of Mordred',
    description: `You are a **minion of Mordred**. 
    You're working for **Evil**. 
    You know your accomplices beforehand :`,
    isEvil: true,
    knowledge: other => other.isEvil && other.name !== name
});

exports.assassin = name => ({
    name,
    role: 'Assassin',
    description: `You are the **Assassin**. 
    You're working for **Evil**. 
    If Good manages to find the Graal, you can still try to kill Merlin, if you manage to find out who he is.
    You know your accomplices beforehand :`,
    isEvil: true,
    knowledge: other => other.isEvil && other.name !== name
});

exports.mordred = name => ({
    name,
    role: 'Mordred',
    description: `You are **Mordred**. 
    You're working for **Evil**. 
    You are unknown to Merlin.
    You know your accomplices beforehand :`,
    isEvil: true,
    knowledge: other => other.isEvil && other.name !== name
});

exports.percival = name => ({
    name,
    role: 'Percival',
    description: `You are **Percival**. 
    You're working for **Good**. 
    You know who Merlin is exactly if there's only Merlin in game. 
    However, if Morgana is also present in a game with Merlin, you will need to deduce which Merlin is the real Merlin throughout the game.
    You will gain knowledge of two potential "Merlins" if both Merlin and Morgana are present. 
    You know your accomplices beforehand :`,
    isEvil: false,
    knowledge: other => ['Merlin', 'Morgana'].includes(other.role)
});

exports.morgana = name => ({
    name,
    role: 'Morgana',
    description: `You are **Morgana**. 
    You're working for **Evil**. 
    You appear as Merlin to the eyes of Percival.
    You know your accomplices beforehand :`,
    isEvil: true,
    knowledge: other => other.isEvil && other.name !== name
});
