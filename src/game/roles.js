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
    knowledge: other => other.isEvil
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
