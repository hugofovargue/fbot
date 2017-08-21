const data = require('../Resources/data.json');

module.exports = {
  generate: (target, options) => {
    const targetObj = data[target];

    if (!targetObj) return 'err: target is null or undefined';

    switch (options) {
      case 'emoji':
      case 'emojis':
        return `${targetObj.name} has sent ${targetObj.emojisSent} emojis.`;
      case 'react':
      case 'reactions':
        return `${targetObj.name} has sent ${targetObj.reactionsSent} reactions.`;
      default:
        return `${targetObj.name} has sent ${targetObj.messagesSent} messages.`;
    }
  } // eslint-disable-line
};
