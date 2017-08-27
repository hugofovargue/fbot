const fs = require('fs');
const path = require('path');

module.exports = {
  fsRead: (filePath, callback) => {
    fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
      if (err) throw err;
      callback(JSON.parse(data));
    });
  },
  fsWrite: (filePath, obj) => {
    const json = JSON.stringify(obj);
    fs.writeFile(path.join(__dirname, filePath), json, 'utf8', (err) => {
      if (err) throw err;
      console.log('File has been saved.');
    });
  }
  /* TODO
  fsAppend: () => {

  }
  */
};
