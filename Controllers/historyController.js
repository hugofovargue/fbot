const utils = require('../utils.js');

let data = {};

function loadThreadHistory(api, threadID, messageCount) {
  const messageStack = [];
  const timestamp = (data.lastGetThreadHistory ? data.lastGetThreadHistory : undefined);

  api.getThreadHistory(threadID, messageCount, timestamp, (err, history) => { //eslint-disable-line
    if (err) return console.error(err);
    if (history === [] || undefined) return console.error('There are no new messages.');

    for (let index = history.length - 1; index >= 0; index -= 1) {
      if (history[index].timestamp === data.lastGetThreadHistory) {
        data.lastGetThreadHistory = history[index].timestamp;
      } else {
        messageStack.push(history[index]);
      }
    }
    parseThreadHistory(messageStack);
  });
}

// This func parses the history array then updates the data.json
function parseThreadHistory(messageStack) {
  console.log('stack: ' + messageStack.length);
  data.lastGetThreadHistory = messageStack[messageStack.length - 1].timestamp;

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
  console.log('parseReactions reached: ');
  console.log(reactions);
  for (let i = 0; i < data.userStats.length; i += 1) {
    const senderIndex = i;
    const senderID = data.userStats[i].userID;

    console.log('this is senderID' + senderID);
    for (let j = 0; j < Object.keys(reactions).length; j += 1) {
      console.log('checking sender ' + reactions[senderID]);
      switch (reactions[senderID]) { //eslint-disable-line
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
