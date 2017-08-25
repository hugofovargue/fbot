const fs = require('fs');
const login = require('facebook-chat-api');
const historyController = require('./Controllers/historyController.js');
const responses = require('./Responses/controller.js');

login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
  if (err) return console.log(err);

  api.setOptions({ listenEvents: true });

  const threadID = 100000576646838;
  historyController.fetchThreadHistory(api, threadID);

  api.listen((err, event) => {
    if (err) return console.error(err);
    switch (event.type) {
      case 'message':
        if (event.body.startsWith('$')) {
          api.markAsRead(event.threadID, (err) => {
            if (err) console.log(err);
          });
          api.sendMessage(
            responses.parseRequest(event.body),
            event.threadID
          );
        }
        break;
      case 'event':
        console.log(event);
        break;
    // no default
    }
  });
});
