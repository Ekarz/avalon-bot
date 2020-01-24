const join = require('./join');
const host = require('./host');
const start = require('./start');
const state = require('../game/state');

const message = name => ({
    author: name,
    react: jest.fn()
});

it('should not start if there is not enough players', () => {
    host.execute(message('Alice'));
    join.execute(message('Bob'));
    join.execute(message('Connor'));

    expect(state.started).toBe(false);
    start.execute(message('Alice'));
    expect(state.started).toBe(false);
});

it('should not start if the message is not from the owner', () => {
    host.execute(message('Alice'));
    join.execute(message('Bob'));
    join.execute(message('Connor'));
    join.execute(message('Dave'));
    join.execute(message('Edith'));

    expect(state.started).toBe(false);
    start.execute(message('Bob'));
    expect(state.started).toBe(false);
});

it('should start if the message is from the owner', () => {
    host.execute(message('Alice'));
    join.execute(message('Bob'));
    join.execute(message('Connor'));
    join.execute(message('Dave'));
    join.execute(message('Edith'));

    expect(state.started).toBe(false);
    start.execute(message('Alice'));
    expect(state.started).toBe(true);
});
