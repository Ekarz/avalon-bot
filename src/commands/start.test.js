const join = require('./join');
const host = require('./host');
const start = require('./start');
const state = require('../game/state');

jest.mock('../game/manager');

const message = id => ({
    author: { id },
    react: jest.fn(),
    channel: { send: jest.fn() }
});

beforeAll(() => {
    state.channel = { send: () => null };
});

it('should not start if there is not enough players', () => {
    host.execute(message('123'));
    join.execute(message('456'));
    join.execute(message('789'));

    expect(state.started).toBe(false);
    start.execute(message('123'));
    expect(state.started).toBe(false);
});

it('should not start if the message is not from the owner', () => {
    host.execute(message('123'));
    join.execute(message('456'));
    join.execute(message('789'));
    join.execute(message('111'));
    join.execute(message('999'));

    expect(state.started).toBe(false);
    start.execute(message('456'));
    expect(state.started).toBe(false);
});

it('should start if the message is from the owner', () => {
    host.execute(message('123'));
    join.execute(message('456'));
    join.execute(message('789'));
    join.execute(message('111'));
    join.execute(message('999'));

    expect(state.started).toBe(false);
    start.execute(message('123'));
    expect(state.started).toBe(true);
});
