const data = require('../Resources/threadData.json');

module.exports = {

  help: () => '*List of commands and usage:* \u000D $stats <target> [-option] - _Produces stats on target user(s); Valid options -react, -emoji._ \u000D $getall - _Retreives list of valid targets_',

  getall: () => {
    let targets = '';
    for (let i = 0; i < data.length; i += 1) {
      targets += data[i].name;
      if (i !== (data.length - 1)) targets += ', ';
    }
    return `*Valid Targets:* all, me, ${targets}`;
  } // eslint-disable-line
};
