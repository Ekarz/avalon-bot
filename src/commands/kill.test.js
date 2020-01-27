const kill = require('./kill');
const state = require('../game/state');
const { merlin, servant, assassin, minion } = require('../game/roles');

const message = name => ({
    author: state.playerTags.find(p => p.username === name),
    react: jest.fn()
});

beforeAll(() => {
    state.channel = { send: () => null };
    state.playerTags = [
        { id: '0', username: 'Alice' },
        { id: '1', username: 'Bob' },
        { id: '2', username: 'Connor' },
        { id: '3', username: 'Dave' },
        { id: '4', username: 'Edith' }];
    state.players = [merlin('Alice'), servant('Bob'), minion('Connor'), assassin('Dave'), servant('Edith')];
});

it('should refuse command if game is not started', () => {
    state.started = false;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['<@!1>']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if game if wrong phase', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    const msg = message('Dave');

    kill.execute(msg, ['<@!1>']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if player is not the assassin', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Alice');

    kill.execute(msg, ['<@!1>']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if killed player not in the game', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['<@!123>']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if killed player is evil', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['<@!2>']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if you kill yourself', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['<@!3>']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should accept command', () => {
    state.started = true;
    state.phase = 'ASSASSIN';
    const msg = message('Dave');

    kill.execute(msg, ['<@!1>']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.team).toEqual([]);
});
