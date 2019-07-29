module.exports = {
  selector: '.source.br',
  disableForSelector: '.source.br .comment',
  // priority: 1,
  filterSuggestions: true,
  inclusionPriority: 1,
  excludeLowerPriority: true,

  getSuggestions (request) {
    if (request.prefix.length>2){
      var completions = []
      // console.log("request");
      // console.log(request);
      // console.log("REG");
      // console.log(str);
      var search = /^(?:\d{0,5}\s+)(?:def\s+)(fn[\w][\w-\d|$]+)([\(|&]+[\w|$|;|&|,|\)| ]+)?/img
      request.editor.scan(search,{
      },(match)=>{
        // console.log("match")
        // console.log(match.matchText

        // var findFunctionName = new RegExp("\\bfn\\w[\\w-\\d]+\\$?","i")
        // var findSearchName = new RegExp("\\bfn\\w[\\w-\\d]+","gi")
        // var findAllParams = new RegExp("\\(.*","gi")
        // var findFunctionCall = new RegExp("\\bfn.*\\b","gi")

        var functionName = match.match[1]
        var searchName = match.match[1]
        var functionCall = match.match.slice(1).join("")

        if (match.match[2]){
          var paramString = match.match[2]
          var allParams = paramString
          if (paramString.includes("___")){
            allParams = paramString.split("___")[0].substring(0,paramString.split("___")[0].length-1)+")"
          }

          var requiredParams = allParams
          if (allParams.includes(";")){
            var requiredParams = allParams.split(";")[0]+")"
          }

          var params = requiredParams.replace(/(\(|\))/gi,"").split(",")
          var snippet = `${functionName}(\${`
          for (var i = 0; i < params.length; i++) {
            if (i>0){
              snippet+='},${'
            }
            snippet+=`${i+1}:${params[i]}`
          }
          snippet+=`})$0`

          //console.log(params);
          // console.log(snippet)
        }

        // console.log("functionName")
        // console.log(functionName)
        var description = match.matchText.toString()
        var type = "Numeric"
        if (functionName.includes("$")) {
           type = "String"
        }
        var completion = {
          text: searchName,
          type: 'function',
          snippet: snippet,
          leftLabel: type,
          //rightLabel: null,
          description: functionName+allParams,
          displayText: functionName+requiredParams
        }
        completions.push(completion)
      })
      //console.log("scan done");
      return completions
    }
  },
  getTagDocsURL(tag){
    return `http://brwiki.brulescorp.com/index.php?search=${tag}`
  },
  onDidInsertSuggestion ({editor, suggestion}) {
    if (suggestion.type === 'attribute') {
      setTimeout(this.triggerAutocomplete.bind(this, editor), 1)
    }
  },

  triggerAutocomplete (editor) {
    console.log("auto");
    console.log(editor);
    atom.commands.dispatch(
      editor.getElement(),
      'autocomplete-plus:activate',
      {activatedManually: false}
    )
  }
}
