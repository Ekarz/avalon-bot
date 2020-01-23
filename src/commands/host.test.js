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

it('should host a new game', () => {
    expect(playerTags).toHaveLength(0);

    host.execute(messageAlice);

    expect(playerTags).toHaveLength(1);
});

it('should not host a new game if one is already hosted', () => {
    host.execute(messageAlice);
    host.execute(messageAlice);
    expect(playerTags).toHaveLength(1);

    host.execute(messageBob);
    expect(playerTags).toHaveLength(1);
});