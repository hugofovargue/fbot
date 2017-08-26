const utils = require('../utils.js');

let data = {};

function loadThreadHistory(api, threadID, messageCount) {
  const messageStack = [];

  api.getThreadHistory(threadID, messageCount, undefined, (err, history) => { //eslint-disable-line
    if (err) return console.error(err);

    for (let index = history.length - 1; index >= 0; index -= 1) {
      if (history[index].timestamp === data.lastGetThreadHistory) break;
      messageStack.push(history[index]);
    }

    data.lastGetThreadHistory = history[history.length - 1].timestamp;
    if (messageStack.length > 0) parseThreadHistory(messageStack);
  });
}

// This func parses the history array then updates the data.json
function parseThreadHistory(messageStack) {
  messageStack.forEach((msg) => {
    for (let index = 0; index < data.userStats.length; index += 1) {
      if (msg.senderName === data.userStats[index].name) {
        data.userStats[index].messagesSent += 1;

        if (msg.reactions) parseReactions(msg.reactions, index);  //eslint-disable-line
        // TODO: if(msg.attachments) parseAttachments(msg);
      }
    }
  });
  console.log(data);
  utils.fsWrite('../fbot/Resources/threadData.json', data);
}

function parseReactions(reactions, userIndex) {
  for (let i = 0; i < data.userStats.length; i += 1) {
    const senderIndex = i;
    const senderID = data.userStats[i].userID;

    for (let j = 0; j < Object.keys(reactions).length; j += 1) {
      switch (reactions[senderID]) {
        case ':thumbsup:':
        case ':like:':
        case '\uD83D\uDC4D':
        case '👍':
          addReactionReceived(userIndex, 'like');
          addReactionSent(senderIndex, 'like');
          break;
        case ':thumbsdown:':
        case ':dislike:':
        case '\uD83D\uDC4E':
        case '👎':
          console.log('found a dislike!');
          addReactionReceived(userIndex, 'dislike');
          addReactionSent(senderIndex, 'dislike');
          break;
        case ':angry:':
        case '\uD83D\uDE20':
        case '😠':
          addReactionReceived(userIndex, 'angry');
          addReactionSent(senderIndex, 'angry');
          break;
        case ':cry:':
        case ':sad:':
        case '\uD83D\uDE22':
        case '😢':
          addReactionReceived(userIndex, 'sad');
          addReactionSent(senderIndex, 'sad');
          break;
        case ':wow:':
        case ':open_mouth:':
        case '\uD83D\uDE2E':
        case '😮':
          addReactionReceived(userIndex, 'wow');
          addReactionSent(senderIndex, 'wow');
          break;
        case ':haha:':
        case ':laughing:':
        case '\uD83D\uDE06':
        case '😆':
          addReactionReceived(userIndex, 'haha');
          addReactionSent(senderIndex, 'haha');
          break;
        case ':love:':
        case ':heart_eyes:':
        case '\uD83D\uDE0D':
        case '😍':
          addReactionReceived(userIndex, 'love');
          addReactionSent(senderIndex, 'love');
          break;
        // no default
      }
    }
  }
}

function addReactionReceived(user, reaction) {
  data.userStats[user].reactionsReceived.total += 1;
  data.userStats[user].reactionsReceived[reaction] += 1;
}

function addReactionSent(user, reaction) {
  console.log(data.userStats[user]);
  data.userStats[user].reactionsSent.total += 1;
  data.userStats[user].reactionsSent[reaction] += 1;
}

module.exports = {
  fetchThreadHistory: (api, threadID) => {
    utils.fsRead('../fbot/Resources/threadData.json', (obj) => {
      data = obj;
      api.getThreadInfo(threadID, (err, info) => { //eslint-disable-line
        if (err) return console.error(err);
        loadThreadHistory(api, threadID, info.messageCount); //eslint-disable-line
      });
    });
  }
};
