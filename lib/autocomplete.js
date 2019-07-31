const numeric_functions = require('../completions/numeric_functions');
const string_functions = require('../completions/string_functions');
const statements = require('../completions/statements');

const fileio = require('../completions/fileio')
const screenio = require('../completions/screenio')

const internalFunctions = numeric_functions.concat(string_functions).concat(statements);

module.exports = {
  selector: '.source.br',
  disableForSelector: '.source.br .comment',
  // priority: 1,
  filterSuggestions: true,
  inclusionPriority: 1,
  excludeLowerPriority: true,


    /*
      We need to remove all non-snippets snippets and turn them into the "Completion Details" file below.

      Completions need to include:
        User Defined Functions
        All Library Functions for any library statements in the current program
        Internal Functions
        Statements
        Layouts
        All Variables
          Just the ones available in the current program, listed with a dim statement or listed in the current functions definition if the file has Option Explicit in it.
          If no Option Explicit, then list all variables
        Commands (only if you're in a string on a line with an execute statement)
        if you're on a Library statement, typing the functions, it should look in that library and return only
          valid funtions in that library


        We need to have a system that looks up details for a completion from the stuff
        that we entered earlier. For any Snippets that aren't really snippets. We'll copy those ones into a
        "Completions Details" file and look up those details to fill in the gaps in what we already have provided,
        The Statements and Internal Functions will just be pulled in since they're always available. The functions
        will be read only if they're available in the current context (a library statement).

        Snippets that ARE snippets we keep as snippets.

        Ultimately we'll need to support Context somehow. It needs to check whats valid in the current
        cursor location and provide only a list of options for that location. This might entail adding
        some extra information about the parameters for all functions when we're first looking them up,
        so that we can use that information to determine whats available in the current context.

        When reading User Defined Functions, if there's better detail in one of our lists already enterd,
        then we need to use that detail when building the completion.
    */
  processSuggestions(suggestion){

  },

  suggestionProcessor(suggestions){
    if (suggestions.prototype === Promise){
      suggestions.then((results)=>{
        this.processResult(results)
      })
    } else {
      this.processResult(processSuggestions)
    }
  },

  getSuggestions (request) {
    return new Promise((resolve)=>{
      if (request.prefix.length>2){
        var completions = []

        completions = completions.concat(this.getInternal(request))   // Get the Internal Functions and Statements
        completions = completions.concat(this.getFunctions(request))  // Get the Functions
        completions = completions.concat(this.getVariables(request))  // Get the Variables
        completions = completions.concat(this.getLibraryFunctions(request)) // Get the Library Functions
        completions = completions.concat(this.getLayouts(request)) // Get the File Layouts
        if (atom.config.get('language-br.includeScreenioAutocomplete')) {
          completions = completions.concat(this.getScreenIO(request)) // Get the Standard Libraries
        }
        if (atom.config.get('language-br.includeFileioAutocomplete')) {
          completions = completions.concat(this.getFileIO(request)) // Get the Standard Libraries
        }

        // If we're in a library statement we only want to call Library Functions, not the others.
        fs.readFile("myfile",(filecontents)=>{
          // completions.add
          resolve(completions)
        })

      }
    })
  },

 getLayouts(request,cb) {
    var completions = []

    // Read the layout path
    var layoutPath = this.readLayoutPath()


    /*
      Scan the program for any Open statements and see which layouts are being opened and
      read those layouts to get the Subscripts from all of them.

      If the current context is you're in an fnOpen statement in the Quotes, then return a list
      of all valid layouts
    */

    return completions
  },

  readLayoutPath() {
    var layoutPath
    // open the fileio.ini file if found. Its either in a "fileio" folder or the root of the project.
    // read it looking for a "filelayout$=" statement and read everything that is on the right of the =
    // if not found, or if we can't find any of this, layout path defaults to "filelay"

    layoutPath="filelay\\"


    return layoutPath
  },

  getVariables(request) {
    var completions = []

    /* Get all variables available in the current program */
    /* if the current file has "option dimonly" in it somewhere, then
         get only variables available in the current function plus all variables with a dim statement.
       else
         get all variables listed in the current program
       end if
    */



    return completions
  },

  getLibraryFunctions(request) {
    var completions = []
    /*
      If we're in a library statement:
        if we're in the quotes, then it should show
          if we're in a path:
            any programs available in that path (files ending with .dll, .wb, br, (maybe .dll is a config setting, george uses it)
            any subfolders in that path (exclude .git and .svn automatically)
          if we're in the root:
            any letters from drive statements
            any programs available in the current directory
            any subfolders in that current directory
        if we're after the : then
          this function reads the targeted file and makes available any functions that are in it.
          completions should be just the function names. Description still shows the whole function.

      If we're not in a library statement then
        we need to read all library statements in the program and return detailed completions for
        all library functions in each of them.
    */
    return completions
  },

  /*
    Return preentered functions and system standard calls in these next 3.

    We have these defined in separate files in the "completions" folder.
    These are pulled in by the "requires" lines at the top of this document,
    and returned in the constant internalFunctions below.
  */

  getInternal(request) {
    /* if the context is right, pull in commands as well. (in a string on a line with Execute in it) */
    return internalFunctions
  },

  getScreenIO(request) {
    return screenio
  },

  getFileIO(request) {
    return fileio
  },

  getFunctions(request) {
    var completions = []
    var search = /^(?:\d+)?(?:\s+)?(?:def\s+)(fn[\w](?:[\w\d]+)?(\$)?)(?:(?:\()([\w\d\$;&, *]+)(?:\)))?/img
    request.editor.scan(search,{
    },(match)=>{

      [functionCall,functionName,stringChar,paramString] = match.match

      var allParams = ""
      var requiredParams = ""
      var requiredParamsList = []
      var optionalParamsList = []
      var paramList = []
      var description = functionName

      // if (functionName==="FNOPEN"){debugger}

      if (paramString){

        [requiredParams,optionalParams]=paramString.split(";")
        //
        requiredParamsList = requiredParams.split(",")
        //
        if (optionalParams){
          if (optionalParams.includes(",___")){
            [optionalParams] = optionalParams.match(/^.*(?=,___)/i)
          } else {
            optionalParams = ""
          }
          optionalParamsList = optionalParams ? optionalParams.split(",") : []
        }

        if (requiredParamsList){
          paramList.concat(requiredParamsList)
        }

        if (optionalParamsList){
          paramList.concat(optionalParamsList)
        }

        // paramList = requiredParams.split(",")
        var snippet = `${functionName}(\${`
        description+='('
        for (var i = 0; i < requiredParamsList.length; i++) {
          if (i>0){
            snippet+='},${'
            description+=', '
          }
          snippet+=`${i+1}:${requiredParamsList[i]}`
          description+=requiredParamsList[i]
        }
        if (optionalParamsList.length){
          snippet+='};${'
          description+='; '
          for (var i = 0; i < optionalParamsList.length; i++) {
            if (i>0){
              snippet+='},${'
              description+=', '
            }
            snippet+=`${i+requiredParamsList.length+1}:${optionalParamsList[i]}`
            description+=optionalParamsList[i]
          }
        }
        snippet+=`})$0`
        description+=')'
      }

      // console.log("functionName")
      // console.log(functionName)
      // var description = functionName
      // if (requiredParamsList){
      //   description+=`(${paramList.join(",")})`
      // }

      var type = "Numeric"
      if (stringChar) {
        type = "String"
      }

      /* Check our old User Defined Function snippets to see if there's
         better information to use here. */

      var completion = {
        text: functionName,
        type: 'function',
        snippet: snippet,
        leftLabel: type,
        //rightLabel: null,
        description: description,
        // descriptionMoreURL:
        displayText: description
      }
      completions.push(completion)
    })
    //console.log("scan done");
    return completions
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
