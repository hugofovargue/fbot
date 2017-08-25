const data = require('../Resources/threadData.json');
const helper = require('./helper.js');
const stats = require('./stats.js');

const validateTarget = (target) => {
  if (!target) return null;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].name === target) {
      return i;
    }
  }
  return null;
};

const validateOptions = (options) => {
  if (options) return options;
  return null;
};


module.exports = {
  parseRequest: (request) => {
    // Validate request. Then store request keywords into segments.
    if (request === '$') return 'err: command not complete';
    const segments = request.match(/\w+/gi);

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
        return stats.generate(target, options);
      default:
        return 'err: command did not match';
    }
  } // eslint-disable-line
};
