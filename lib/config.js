const fs = require('fs');
const path = require('path');

const configFilename = "br-project.json"

class Config {
  async Read(configPath){
    return await new Promise((resolve)=>{
      fs.readFile(configPath, 'utf8', (err, data)=>{
        let result = {};
        try {
          result = JSON.parse(data)
          resolve(result)
        } catch (e) {
          throw new Error(`Error parsing config file.\n${e.name}: ${e.message}`);
        }
      });
    }).catch(err => {
      throw err;
    })
  }
}

module.exports = new Config();
