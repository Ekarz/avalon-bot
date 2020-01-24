const team = require('./team');
const state = require('../game/state');

const message = name => ({
    author: name,
    react: jest.fn()
});

beforeAll(() => {
    state.channel = { send: () => null };
});

it('should refuse command if game is not started', () => {
    state.started = false;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const msg = message('Alice');

    team.execute(msg, ['Alice', 'Bob']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if wrong phase', () => {
    state.started = true;
    state.phase = 'VOTES';
    state.quest = 1;
    state.leaderIndex = 0;
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const msg = message('Alice');

    team.execute(msg, ['Alice', 'Bob']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if number of players', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const msg = message('Alice');

    team.execute(msg, ['Alice', 'Bob', 'Connor']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if wrong players', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const msg = message('Alice');

    team.execute(msg, ['Alice', 'Toto']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if player is not the leader', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 1;
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const msg = message('Alice');

    team.execute(msg, ['Alice', 'Bob']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should accept team', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    const msg = message('Alice');

    team.execute(msg, ['Alice', 'Bob']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.team).toEqual(['Alice', 'Bob']);
});
