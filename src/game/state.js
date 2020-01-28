exports.host = '';
exports.channel = '';
exports.playerTags = [];
exports.started = false;

exports.players = [];
exports.quest = 0;
exports.attempts = 0;
exports.leaderIndex = 0;

exports.team = [];
exports.votes = {};
exports.actions = {};
exports.results = [];

exports.phase = '';

exports.endGame = () => {
    for (const player of this.players) {
        this.channel.send(`**${player.name}** was **${player.role}**`);
    }

    this.host = '';
    this.channel = '';
    this.playerTags = [];
    this.started = false;
};
