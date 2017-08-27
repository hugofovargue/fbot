module.exports = {
  generate: (target, options, data) => {
    const targetObj = data[target];
    if (!targetObj) return 'err: target is null or undefined';

    switch (options) {
      case 'emoji':
      case 'emojis':
        return `${targetObj.shortname} has sent ${targetObj.emojisSent.total} emojis.`;
      case 'react':
      case 'reactions':
        return `${targetObj.shortname} has sent ${targetObj.reactionsSent.total} reactions.`;
      default:
        return `${targetObj.shortname} has sent ${targetObj.messagesSent.total} messages.`;
    }
  } // eslint-disable-line
};
