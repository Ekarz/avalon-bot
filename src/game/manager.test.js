const state = require('./state');
const { startGame, startVotes, handleVoteResults, handleQuestResults } = require('./manager');
const { merlin, assassin, minion, servant } = require('./roles');


// tests keep state from one to the other

beforeAll(() => {
    state.channel = {
        send: jest.fn(),
        members: [
            { user: { username: 'Alice', send: jest.fn() } },
            { user: { username: 'Bob', send: jest.fn() } },
            { user: { username: 'Connor', send: jest.fn() } },
            { user: { username: 'Dave', send: jest.fn() } },
            { user: { username: 'Edith', send: jest.fn() } }
        ]
    };
    state.playerTags = ['Alice', 'Bob', 'Connor', 'Dave', 'Edith'];
    state.players = [merlin('Alice'), servant('Bob'), minion('Connor'), assassin('Dave'), servant('Edith')];
});

it('should start the game', () => {
    startGame();

    expect(state.quest).toBe(1);
    expect(state.attempts).toBe(1);
    expect(state.leaderIndex).toBe(1);
    expect(state.phase).toBe('TEAM_BUILDING');
});

it('should start a vote', () => {
    startVotes();

    expect(state.quest).toBe(1);
    expect(state.attempts).toBe(1);
    expect(state.leaderIndex).toBe(1);
    expect(state.phase).toBe('VOTES');
});

it('should handle vote refused', () => {
    state.votes.Alice = 'reject';
    state.votes.Bob = 'reject';
    state.votes.Connor = 'accept';
    state.votes.Dave = 'accept';
    state.votes.Edith = 'reject';
    handleVoteResults();

    expect(state.quest).toBe(1);
    expect(state.attempts).toBe(2);
    expect(state.leaderIndex).toBe(2);
    expect(state.phase).toBe('TEAM_BUILDING');
});

it('should handle last vote accepted by default', () => {
    startVotes();

    expect(state.quest).toBe(1);
    expect(state.attempts).toBe(0);
    expect(state.leaderIndex).toBe(2);
    expect(state.phase).toBe('QUEST');
});

it('should handle quest failed', () => {
    state.actions.Alice = 'success';
    state.actions.Bob = 'success';
    state.actions.Dave = 'fail';
    handleQuestResults();

    expect(state.quest).toBe(2);
    expect(state.results).toEqual(['FAIL']);
    expect(state.attempts).toBe(1);
    expect(state.leaderIndex).toBe(3);
    expect(state.phase).toBe('TEAM_BUILDING');
});

it('should handle vote accepted', () => {
    startVotes();
    state.votes.Alice = 'accept';
    state.votes.Bob = 'reject';
    state.votes.Connor = 'accept';
    state.votes.Dave = 'accept';
    state.votes.Edith = 'reject';
    handleVoteResults();

    expect(state.quest).toBe(2);
    expect(state.results).toEqual(['FAIL']);
    expect(state.attempts).toBe(0);
    expect(state.leaderIndex).toBe(3);
    expect(state.phase).toBe('QUEST');
});

it('should handle quest succeeded', () => {
    state.actions.Alice = 'success';
    state.actions.Bob = 'success';
    state.actions.Connor = 'success';
    handleQuestResults();

    expect(state.quest).toBe(3);
    expect(state.results).toEqual(['FAIL', 'SUCCESS']);
    expect(state.attempts).toBe(1);
    expect(state.leaderIndex).toBe(4);
    expect(state.phase).toBe('TEAM_BUILDING');
});
