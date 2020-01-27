const vote = require('./vote');
const state = require('../game/state');

const message = name => ({
    author: name,
    react: jest.fn()
});

beforeAll(() => {
    state.channel = { send: jest.fn() };
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
