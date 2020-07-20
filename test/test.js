const fs = require('fs');
const assert = require('assert');
const config = require('../lib/config.js');
const path = require('path');

describe('BR Language Support', function(){
  describe('GetConfig', function(){
    const testDir = "/test_project"
    const configFilename = "br-project.json"
    const configPath = path.join(testDir, configFilename)

    const testconfig = JSON.stringify({
      "layoutFolder": "filelay"
    })

    before(function(){
      // create test project
      try {
        fs.mkdirSync(testDir);
      } catch(err){
        if (err.name = "EEXIST"){
          console.warn("WARNING: Test project already exists.")
        }
      }

      fs.writeFileSync(configPath, testconfig)

    })

    it('should read and parse a config file.', async function(){
      var testConfig = await config.Read(configPath)
      assert.equal(testConfig.layoutFolder, "filelay")
    })

    after(function(){
      try {
        fs.unlinkSync(configPath)
        fs.rmdirSync(testDir)
      } catch (err){
        console.warn("WARNING: Error removing test project.", configPath, testDir)
      }
    })
  })
})
