const utils = require('../utils.js');
const helper = require('./helper.js');
const stats = require('./stats.js');

let data = [];

function parseRequest(req) {
  const segments = req.match(/\w+/gi);

  // Assign Command, then validate command.
  const command = segments[0];
  if (!command) return 'command null or undefined';

  // Validate following target and options, then assign them.
  const target = validateTarget(segments[1]);
  const options = validateOptions(segments[2]);

  // Invoke the appropriate functions based on command, and pass target and options args.
  switch (command) {
    case '':
    case 'help':
      return helper.help();
    case 'getall':
      return helper.getall();
    case 'stats':
      return stats.generate(target, options, data);
    default:
      return 'err: command did not match';
  }
}

function validateTarget(target) {
  if (!target) return null;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].shortname === target) {
      return i;
    }
  }
  return null;
}

function validateOptions(options) {
  if (options) return options;
  return null;
}


module.exports = {
  validateRequest: (req) => {
    if (req === '$') return 'err: command not complete';

    utils.fsRead('../fbot/Resources/threadData.json', (obj) => {
      data = obj.userStats;
    });

    return parseRequest(req);
  } // eslint-disable-line
};
