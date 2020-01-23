let playerTags = [];
exports.playerTags = playerTags;

let host = '';
exports.host = host;

exports.name = 'host';
exports.channelOnly = true;
exports.description = 'Host a new game';
exports.usage = '';
exports.execute = (message, args) => {
    if (playerTags.length) {
        return message.react('🚫');
    }

    playerTags.push(message.author);
    host = message.author;
    message.react('👍');
};
