const kill = require('./kill');
const state = require('../game/state');
const { merlin, servant, assassin, minion } = require('../game/roles');

const message = name => ({
    author: name,
    react: jest.fn()
});

beforeAll(() => {
    state.channel = { send: () => null };
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    state.players = [merlin('Alice'), servant('Bob'), minion('Connor'), assassin('Dave'), servant('Edith')];
});

it('should refuse command if game is not started', () => {
    state.started = false;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['Bob']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if game if wrong phase', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    const msg = message('Dave');

    kill.execute(msg, ['Bob']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if player is not the assassin', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Alice');

    kill.execute(msg, ['Bob']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if killed player not in the game', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['Toto']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should accept command', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['Bob']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.team).toEqual([]);
});
