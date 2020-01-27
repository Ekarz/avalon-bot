const vote = require('./vote');
const state = require('../game/state');

const message = author => ({
    author: state.playerTags.find(p => p.username === author) || author,
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

beforeEach(() => {
    state.votes = {};
});

it('should refuse vote if game is not started', () => {
    state.started = false;
    state.phase = 'VOTES';
    const msg = message('Alice');

    vote.execute(msg, ['accept']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.votes).toEqual({});
});

it('should refuse vote if wrong phase', () => {
    state.started = true;
    state.phase = 'TEAM_BUILDING';
    const msg = message('Alice');

    vote.execute(msg, ['accept']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.votes).toEqual({});
});

it('should refuse vote if wrong vote', () => {
    state.started = true;
    state.phase = 'VOTES';
    const msg = message('Alice');

    vote.execute(msg, ['dumb']);

    expect(msg.react).toHaveBeenCalledWith('🚫');
    expect(state.votes).toEqual({});
});

it('should accept vote accepted', () => {
    state.started = true;
    state.phase = 'VOTES';
    const msg = message('Alice');

    vote.execute(msg, ['accept']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.votes).toEqual({ Alice: 'accept' });
});

it('should accept vote rejected', () => {
    state.started = true;
    state.phase = 'VOTES';
    const msg = message('Alice');

    vote.execute(msg, ['reject']);

    expect(msg.react).toHaveBeenCalledWith('👍');
    expect(state.votes).toEqual({ Alice: 'reject' });
});

it('should refuse vote if already voted', () => {
    state.started = true;
    state.phase = 'VOTES';
    const msg = message('Alice');

    vote.execute(msg, ['accept']);
    vote.execute(msg, ['accept']);

    expect(msg.react).toHaveBeenLastCalledWith('🚫');
    expect(state.votes).toEqual({ Alice: 'accept' });
});

it('should refuse vote if not in players', () => {
    state.started = true;
    state.phase = 'VOTES';
    const msg = message({ author: { id: '123', username: 'Toto' } });

    vote.execute(msg, ['accept']);

    expect(msg.react).toHaveBeenLastCalledWith('🚫');
});
