const host = require('./host');
const { playerTags } = require('../game/state');

const message = name => ({
    author: name,
    react: jest.fn()
});

it('should host a new game', () => {
    expect(playerTags).toHaveLength(0);

    host.execute(message('Alice'));

    expect(playerTags).toHaveLength(1);
});

it('should not host a new game if one is already hosted', () => {
    host.execute(message('Alice'));
    host.execute(message('Alice'));
    expect(playerTags).toHaveLength(1);

    host.execute(message('Bob'));
    expect(playerTags).toHaveLength(1);
});
