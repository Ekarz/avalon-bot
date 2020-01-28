const { assassin, merlin, minion, servant, mordred, percival, morgana } = require('./roles');
const { attributeRoles, getKnowledgeMap } = require('./roleAttribution');

it('should randomly give roles to 5 players', () => {
    const playerNames = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];

    const players = attributeRoles(playerNames);

    expect(players.map(player => player.name).sort()).toEqual(playerNames);
    expect(players.map(player => player.role).sort()).toEqual(['Merlin', 'Assassin', 'Loyal servant of Arthur', 'Loyal servant of Arthur', 'Minion of Mordred'].sort());
});

it('should give info to players with knowledge (5 players)', () => {
    const players = [merlin('Alice'), servant('Bob'), minion('Connor'), assassin('Dave'), servant('Edith')];

    const map = getKnowledgeMap(players);

    expect(map['Alice']).toEqual(['Connor', 'Dave']);
    expect(map['Bob']).toEqual([]);
    expect(map['Connor']).toEqual(['Dave']);
    expect(map['Dave']).toEqual(['Connor']);
    expect(map['Edith']).toEqual([]);
});

it('should give info to players with knowledge (6 players)', () => {
    const players = [merlin('Alice'), servant('Bob'), servant('Tom'), mordred('Kim'), assassin('Dave'), servant('Edith'), ];

    const map = getKnowledgeMap(players);

    expect(map['Alice']).toEqual(['Dave']);
    expect(map['Bob']).toEqual([]);
    expect(map['Tom']).toEqual([]);
    expect(map['Kim']).toEqual(['Dave']);
    expect(map['Dave']).toEqual(['Kim']);
    expect(map['Edith']).toEqual([]);
});

it('should give info to players with knowledge (7 players)', () => {
    const players = [merlin('merlin'), servant('servant1'), servant('servant2'), mordred('mordred'), assassin('assassin'), percival('percival'), morgana('morgana')];

    const map = getKnowledgeMap(players);

    expect(map['merlin']).toEqual(['assassin', 'morgana']);
    expect(map['servant1']).toEqual([]);
    expect(map['servant2']).toEqual([]);
    expect(map['mordred']).toEqual(['assassin', 'morgana']);
    expect(map['assassin']).toEqual(['mordred', 'morgana']);
    expect(map['morgana']).toEqual(['mordred', 'assassin']);
    expect(map['percival']).toEqual(['merlin', 'morgana']);
});
