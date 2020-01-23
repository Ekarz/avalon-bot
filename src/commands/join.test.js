const join = require('./join');
const host = require('./host');
const { playerTags } = require('../game/state');

const messageAlice = {
    author: 'Alice',
    react: jest.fn()
};

const messageBob = {
    author: 'Bob',
    react: jest.fn()
};

const messageConnor = {
    author: 'Connor',
    react: jest.fn()
};

it('should not join if there is no hosted game', () => {
    expect(playerTags).toHaveLength(0);

    join.execute(messageAlice);

    expect(playerTags).toHaveLength(0);
});

it('should join a hosted game', () => {
    host.execute(messageAlice);
    join.execute(messageAlice);

    expect(playerTags).toHaveLength(1);

    join.execute(messageBob);
    expect(playerTags).toHaveLength(2);

    join.execute(messageConnor);
    join.execute(messageConnor);
    expect(playerTags).toHaveLength(3);
});