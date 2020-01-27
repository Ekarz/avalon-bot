const team = require('./team');
const state = require('../game/state');

const message = name => ({
    author: state.playerTags.find(p => p.username === name),
    react: jest.fn()
});

beforeAll(() => {
    state.channel = { send: jest.fn() };
    state.playerTags = [
        { id: '0', username: 'Alice' },
        { id: '1', username: 'Bob' },
        { id: '2', username: 'Connor' },
        { id: '3', username: 'Dave' },
        { id: '4', username: 'Edith' }];
});

it('should refuse command if game is not started', () => {
    state.started = false;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    const msg = message('Alice');

    team.execute(msg, ['0', '1']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if wrong phase', () => {
    state.started = true;
    state.phase = 'VOTES';
    state.quest = 1;
    state.leaderIndex = 0;
    const msg = message('Alice');

    team.execute(msg, ['1', '2']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if number of players', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    const msg = message('Alice');

    team.execute(msg, ['1', '2', '3']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if wrong players', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    const msg = message('Alice');

    team.execute(msg, ['1', '123']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if player is not the leader', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 1;
    const msg = message('Alice');

    team.execute(msg, ['1', '2']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should refuse command if same player multiple times', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    const msg = message('Alice');

    team.execute(msg, ['1', '1']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.team).toEqual([]);
});

it('should accept team', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    state.quest = 1;
    state.leaderIndex = 0;
    const msg = message('Alice');

    team.execute(msg, ['1', '2']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.team).toEqual(['1', '2']);
});
