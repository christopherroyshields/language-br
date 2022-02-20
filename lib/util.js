const path = require('path');
const FUNCTION_SEARCH = /(?<= *def *)(?<name>fn[\w]+(?<stringChar>\$?))(?:\*\d+)?(?:\(? *(?<paramString>[\w$* &,;\[\]]*) *\)?)/img

function parseParams(paramString, includeLocals = false){
  const paramList = paramString.replace(/^;|&|mat | /gi,"").replace(/^;/,"").split(/;|,/)

  if (paramList.indexOf("___")>=0){
    if (includeLocals){
      paramList.splice(paramList.indexOf("___"),1)
    } else {
      paramList.splice(paramList.indexOf("___"))
    }
  }

  return paramList
}


module.exports = {
  parseParams,
  sourcePath(objectPath){
    let ext = '.brs'
    if (path.extname(sourcePath)==='.wb'){
      ext = '.wbs'
    }
    return path.join(path.dirname(sourcePath),path.basename(sourcePath,path.extname(sourcePath))+ext)
  },
  objectPath(sourcePath){
    let ext = '.br'
    if (path.extname(sourcePath)==='.wbs'){
      ext = '.wb'
    }
    return path.join(path.dirname(sourcePath),path.basename(sourcePath,path.extname(sourcePath))+ext)
  },
  isBrSource(editor) {
    return editor.getRootScopeDescriptor().scopes.includes(".source.br")
  },
  getFunctions(text) {
    let
      def,
      name,
      stringChar,
      paramString,
      completions = []

    while (func = FUNCTION_SEARCH.exec(text)){
      [def, name, stringChar, paramString] = func
      let
        paramList = parseParams(paramString),
        snippet = name,
        type = stringChar ? "String" : "Number"

      if (paramList.length){
        snippet += `(\${`
        for (var i = 0; i < paramList.length; i++) {
          if (i>0){
            snippet+='},${'
          }
          snippet+=`${i+1}:${paramList[i]}`
        }
        snippet+=`})$0`
      }

      completions.push({
        text: name,
        type: 'function',
        snippet: snippet,
        leftLabel: type,
        description: def,
        displayText: def,
        params: paramList
      })
    }

    return completions

  }

}
