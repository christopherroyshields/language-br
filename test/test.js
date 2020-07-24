const fs = require('fs');
const assert = require('assert');
const config = require('../lib/config.js');
const path = require('path');

describe('BR Language Support', function(){
  describe('Config', function(){
    var
      testDir,
      testSubDir,
      testSubSubDir,
      configPath,
      testconfig

    const configFilename = "br-project.json"

    beforeEach(function(){
      // create test project
      testDir = fs.mkdtempSync(`${path.sep}test_project-`)
      testSubDir = fs.mkdtempSync(path.join(testDir, "subdir-"))
      testSubSubDir = fs.mkdtempSync(path.join(testSubDir, "subdir2-"))
      configPath = path.join(testDir, configFilename)
      const testconfig = JSON.stringify({
        "layoutFolder": "filelay"
      }, null, '\t')

      fs.writeFileSync(configPath, testconfig)
    })

    afterEach(function(){
      try {
        fs.unlinkSync(configPath)
        fs.rmdirSync(testSubSubDir)
        fs.rmdirSync(testSubDir)
        fs.rmdirSync(testDir)
      } catch (err){
        console.warn("WARNING: Error removing test project.", configPath, testDir)
      }
    })

    describe('Read Config', function(){
      it('should read and parse a config file.', async function(){
        var testConfig = await config.Read(configPath)
        assert.equal(testConfig.layoutFolder, "filelay")
      })
    })

    describe('Find Config', function(){
      it("should walk up directory tree and find project file.", async function(){
        var testConfig = await config.Find(testSubSubDir)
        assert.equal(testConfig.layoutFolder, "filelay")
      })
    })


  })
})
