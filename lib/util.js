const path = require('path');

module.exports = {
  sourcePath: function(objectPath){

  },
  objectPath: function(sourcePath){
    let ext = '.br'
    if (path.extname(sourcePath)==='.wbs'){
      ext = '.wb'
    }
    return path.join(path.dirname(sourcePath),path.basename(sourcePath,path.extname(sourcePath))+ext)
  }
}
