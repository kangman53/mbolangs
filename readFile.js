const fs = require('fs');
class readData {
  static readFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, dataString) => {
        if (err) {
          reject(err)
        } else {
          resolve(dataString);
        }
      })
    })
  }

  static readData(file) {
    return new Promise((resolve, reject) => {
      readData.readFile(file)
        .then((dataString) => {
          let rawData = dataString.split('\n');
          rawData = rawData.map( data => data.split(','));
          resolve(rawData);
        })

        .catch((err) => {
          reject(err);
        })
    })
  }
}

module.exports = readData;
