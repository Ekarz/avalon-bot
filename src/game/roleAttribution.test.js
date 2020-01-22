const { attributeRoles, getKnowledgeMap } = require('./roleAttribution');

it('should randomly give roles to 5 players', () => {
    const playerNames = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];

    const players = attributeRoles(playerNames);

    expect(players.map(player => player.name).sort()).toEqual(playerNames);
    expect(players.map(player => player.role).sort()).toEqual(['Merlin', 'Assassin', 'Loyal servant of Arthur', 'Loyal servant of Arthur', 'Minion of Mordred'].sort());
});

it('should give info to players with knowledge (5 players)', () => {
    const playerNames = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const players = attributeRoles(playerNames);

    const map = getKnowledgeMap(players);

    const merlin = players.find(player => player.role === 'Merlin');
    const evils = players.filter(player => player.isEvil);
    const servants = players.filter(player => player.role === 'Loyal servant of Arthur');

    expect(map[merlin.name]).toHaveLength(2);
    expect(map[evils[0].name]).toHaveLength(1);
    expect(map[evils[1].name]).toHaveLength(1);
    expect(map[servants[0].name]).toHaveLength(0);
    expect(map[servants[1].name]).toHaveLength(0);
});
