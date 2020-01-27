const quest = require('./quest');
const state = require('../game/state');
const { merlin, servant, minion, assassin } = require('../game/roles');

const message = name => ({
    author: name,
    react: jest.fn()
});

beforeAll(() => {
    state.channel = { send: jest.fn() };
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    state.players = [merlin('Alice'), servant('Bob'), minion('Connor'), assassin('Dave'), servant('Edith')];
});

beforeEach(() => {
    state.actions = {};
});

it('should refuse action if game is not started', () => {
    state.started = false;
    state.phase = 'QUEST';
    const msg = message('Connor');

    quest.execute(msg, ['fail']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.actions).toEqual({});
});

it('should refuse action if wrong phase', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    const msg = message('Connor');

    quest.execute(msg, ['fail']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.actions).toEqual({});
});

it('should refuse action if wrong action', () => {
    state.started = true;
    state.phase = 'QUEST';
    const msg = message('Connor');

    quest.execute(msg, ['dumb']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.actions).toEqual({});
});

it('should refuse action if player not in quest', () => {
    state.started = true;
    state.phase = 'QUEST';
    state.team = ['Bob', 'Connor', 'Dave'];
    const msg = message('Alice');

    quest.execute(msg, ['fail']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.actions).toEqual({});
});

it('should accept success', () => {
    state.started = true;
    state.phase = 'QUEST';
    state.team = ['Alice', 'Bob', 'Connor', 'Dave'];

    const msg = message('Connor');

    quest.execute(msg, ['success']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.actions).toEqual({ Connor: 'success' });
});

it('should accept fail', () => {
    state.started = true;
    state.phase = 'QUEST';
    state.team = ['Alice', 'Bob', 'Connor', 'Dave'];
    const msg = message('Connor');

    quest.execute(msg, ['fail']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.actions).toEqual({ Connor: 'fail' });
});

it('should refuse fail if good', () => {
    state.started = true;
    state.phase = 'QUEST';
    state.team = ['Alice', 'Bob', 'Connor', 'Dave'];
    const msg = message('Alice');

    quest.execute(msg, ['fail']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.actions).toEqual({});
});

it('should refuse action if already participated', () => {
    state.started = true;
    state.phase = 'QUEST';
    state.team = ['Alice', 'Bob', 'Connor', 'Dave'];
    const msg = message('Connor');

    quest.execute(msg, ['fail']);
    quest.execute(msg, ['fail']);

    expect(msg.react).toHaveBeenLastCalledWith('🚫');
    expect(state.actions).toEqual({ Connor: 'fail' });
});
