const path = require('path');

module.exports = {
  sourcePath: function(objectPath){
    let ext = '.brs'
    if (path.extname(sourcePath)==='.wb'){
      ext = '.wbs'
    }
    return path.join(path.dirname(sourcePath),path.basename(sourcePath,path.extname(sourcePath))+ext)
  },
  objectPath: function(sourcePath){
    let ext = '.br'
    if (path.extname(sourcePath)==='.wbs'){
      ext = '.wb'
    }
    return path.join(path.dirname(sourcePath),path.basename(sourcePath,path.extname(sourcePath))+ext)
  },
  isBrSource: function(editor) {
    return editor.getRootScopeDescriptor().scopes.includes(".source.br")
  }
}
