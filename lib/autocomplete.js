const numeric_functions = require('../completions/numeric_functions');
const string_functions = require('../completions/string_functions');
const statements = require('../completions/statements');
const internalFunctions = numeric_functions.concat(string_functions).concat(statements);

const fileio = require('../completions/fileio')
const screenio = require('../completions/screenio')

const fs = require('fs')
const path = require('path');

const LIBRARY_REGEX = /^\s*(?:\d{1,5}\s+)?def\s+library\s+(?<name>fn\w+(?<isString>\$?))(?<size>\*?\d*)(?:\((?<required>[^;)]*)(?:;(?<optionalTruncated>[&\w,$* ]+),___|;___|;(?<optional>[&\w,$* ]+)\))?)?/img
const LIBRARY_STATEMENT_SEARCH = /^\s*(?:\d{1,5}\s+)?library\s+["'`](?<libPath>[^"'`]+)["'`]\s*:\s+(?<functionList>[^\n!]+)/i
const CONTAINS_EXTERNAL_LIBRARY = /^[^\n!]*library +["'](?<lib>[a-z\\/.]+)["']/i
const LIBRARY_LINK_SEARCH = /^[^\n!]*library +["'](?<lib>[a-z\\/.]+)["'] *: *(?<functionList>\w+\$?(?: *, *\w+\$?)*)/gmi
const LIBRARY_LINK_CURRENT_SEARCH = /(?:^|:)\s*\d{0,5}?\s*library\s+["'`](?<path>[^"'`]+)["'`]/img
const FUNCTION_SEARCH = /(?<= *def *)(?<name>fn[\w]+(?<stringChar>\$?))(?:\*\d+)?(?:\(? *(?<paramString>[\w$* &,;\[\]]*) *\)?)/img
const FNOPEN_SEARCH = /fnopen\(\"([\w|\d]*)\"/img
const DIM_SEARCH = /^ *dim +(?<variables>[\w\d(), $*]+)/gi
const VAR_SEARCH = /(?<varName>[a-z_][a-z0-9_]*(?<isString>\$?))\*?(?<isArray>\(?)/gi

const layoutPath = "filelay"

class Layout {
  constructor(path="",prefix="",version=0,keys=[],subscripts=[]){
    this.path = path
    this.prefix = prefix
    this.version = version
    this.keys = keys
    this.subscripts = subscripts
  }
  static parse(csvBuffer){
    var lines = csvBuffer.split("\n")
    var firstLine = lines[0].split(",")
    // var completions = []
    var layout = new Layout(firstLine[0].trim(),firstLine[1].trim(),parseInt(firstLine[2]))

    // Read all subscripts
    var headerDone = false
    var fieldsDone = false
    for (var i = 1; i < lines.length; i++) {
      if (headerDone){
        if (lines[i].toLowerCase().includes("#eof#")) {
          // a #EOF# line ends the layout
          i = lines.length
        } else if (lines[i].trim().charAt(0)==="!") {
          // A comment line, ignore it

        } else {
          // console.log(lines[i]);
          if (lines[i].trim()!=='') {
            var detailLine = lines[i].split(",")
            // Strip out the dollar sign.
            if (detailLine.length>1){
              layout.subscripts.push({
                name: detailLine[0].trim(),
                description: detailLine[1].trim(),
                format: detailLine[2].trim(),
                line: lines[i].trim()
              })
            } else {
              console.log("Bad Layout Detail Line: " + lines[i])
            }
          }
        }
      } else {
        //parse Header
        if (lines[i].toLowerCase().includes("recl=")) {
          layout.recl=parseInt(lines[i].toLowerCase().replace("recl=",""))
          i++
          headerDone=true
        } else if (lines[i].includes("====")) {
          headerDone=true
        } else {
          var keyLine = lines[i].split(",")
          if (!keyLine[1]){
            console.log("Bad Layout Header Line:"+lines[i])
          } else {
            layout.keys.push({
              path: keyLine[0],
              keyFields: keyLine[1].split("/")
            })
          }
        }
      }
    }
    return layout
  }
}

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

module.exports = {
  selector: '.source.br',
  disableForSelector: '.source.br .comment',
  // priority: 1,
  filterSuggestions: true,
  inclusionPriority: 1,
  suggestionPriority: 1,
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

      When reading User Defined Functions, if there's better detail in one of our lists already enterd,
      then we need to use that detail when building the completion.

      Ultimately we'll need to support Context somehow. It needs to check whats valid in the current
      cursor location and provide only a list of options for that location. This might entail adding
      some extra information about the parameters for all functions when we're first looking them up,
      so that we can use that information to determine whats available in the current context.
  */

  getSuggestions (request) {
    if (request.prefix.length>=2){
      return new Promise((resolve)=>{
        var completions = []
        // debugger
        if (!this.inLibraryStatement(request)) {
          this.suggestionPriority=1

          let text = request.editor.getText()

          this.getCurrentScopeVariables(request,completions)

          this.getDimVariables(request,completions)

          if (atom.config.get('language-br.includeInternalAutocomplete')) {
            completions = completions.concat(this.getInternal(request))   // Get the Internal Functions and Statements
          }

          if (atom.config.get('language-br.includeFunctionAutocomplete')) {
            this.getFunctions(text,completions)  // Get the Functions
          }

          if (atom.config.get('language-br.includeVariableAutocomplete')) {
            completions = completions.concat(this.getVariables(request))  // Get the Variables
          }
          if (atom.config.get('language-br.includeLayoutAutocomplete')) {
            completions = completions.concat(this.getLayouts(request))    // Read File Layouts and Get Subscripts
          }
          if (atom.config.get('language-br.includeScreenioAutocomplete')) {
            completions = completions.concat(this.getScreenIO(request)) // Get the Standard Libraries
          }
          if (atom.config.get('language-br.includeFileioAutocomplete')) {
            completions = completions.concat(this.getFileIO(request)) // Get the Standard Libraries
          }
        } else {
          this.suggestionPriority=3
        }

        if (atom.config.get('language-br.includeLibraryAutocomplete')) {
          this.checkAndUpdateLibraries(request)
            .then(()=>{
              completions = completions.concat(this.getLibraryCompletions(request)) // Get the Library Functions
              //console.log(completions)
          // debugger
              resolve(completions)
            })
        } else {
          resolve(completions)
        }
      })
    }
  },

  getCurrentScopeVariables(request, completions){
    // search backwards for def, fnend, or beginning of file
    var params = []
    request.editor.backwardsScanInBufferRange(/^ *def *fn[a-z0-9_]+\$?(?:\*\d+)?\((?<params>[a-z$_,* &;\[\]]+)\)|\bfnend\b/ig,[[0,0],request.bufferPosition],({match,matchText,range,stop,replace}) => {
      if (matchText!=="fnend"){
        params = this.parseParams(match.groups.params, true)
        if (params){
          for (var i = 0; i < params.length; i++) {
            completions.push({
              text: params[i],
              type: 'variable',
              leftLabel: 'Parameter'
            })
          }
        }
      }
      stop()
    })
  },

  getDimVariables(request, completions){
    request.editor.scan(DIM_SEARCH,{},(dimLine)=>{
      let
        v,
        type,
        label

      while (v = VAR_SEARCH.exec(dimLine.match.groups.variables)){
        name = v.groups.varName
        type = v.groups.isArray ? 'array' : 'variable'
        label = v.groups.isString ? 'String' : 'Number'
        if (this.isUnique(name,type,completions)){
          completions.push({
            text: name,
            type: type,
            leftLabel: label
          })
        }
      }
    })
  },

  isUnique(name,type,completions){
    let match = completions.findIndex(completion=>name === completion.text && type === completion.type)
    return match<0
  },

  init(){
    //debugger
    console.log("init")
    this.layoutList = {}
    this.loadedLibs = {}
    var dirs = atom.project.getDirectories()
    for (var i = 0; i < dirs.length; i++) {
      var layoutFolder = this.findLayoutFolder(dirs[i].path)
      this.layoutList[dirs[i].path] = {}
      this.readFiles(layoutFolder, (filepath, name, ext, stat) => {
        // console.log('file path:', filepath);
        // console.log('file name:', name);
        // console.log('file extension:', ext);
        // console.log('file information:', stat);
        if ((ext.toLowerCase() != ".brs") && (ext.toLowerCase() != ".wbs") && (ext.toLowerCase() != ".br") && (ext.toLowerCase() != ".wb")) {
          fs.readFile(filepath,'utf-8',(err,contents)=>{
            [projectPath] = atom.project.relativizePath(filepath)
            this.layoutList[projectPath][name] = Layout.parse(contents)
          })
        } else {
          //console.log("Skipping File: " + filepath)
        }
      });
      // for (var i = 0; i < layouts.length; i++) {
      //   if (layouts[i].isFile()){
      //     layoutBuffer = fs.readFileSync(path.join(layoutFolder,layouts[i]),'utf8')
      //     parsedLayout = this.fnReadLayout(layoutBuffer)
      //     console.log(parsedLayout)
      //   }
      // }
    }
  },
  readFiles(dir, processFile) {
    // read directory
    fs.readdir(dir,{encoding: 'utf8',withFileTypes :true }, (error, fileNames) => {
      if (error) throw error;

      fileNames.forEach(filename => {
        // get current file name
        const name = path.parse(filename).name;
        // get current file extension
        const ext = path.parse(filename).ext;
        // get current file path
        const filepath = path.resolve(dir, filename);

        // get information about the file
        fs.stat(filepath, function(error, stat) {
          if (error) throw error;

          // check if the current path is a file or a folder
          const isFile = stat.isFile();

          // exclude folders
          if (isFile) {
            // callback, do something with the file
            processFile(filepath, name, ext, stat);
          }
        });
      });
    });
  },

  findLayoutFolder(directory) {
    // search for an atom.ini file.
    // if not found, look for fileio.ini folder. use it to find filelay location.
    return path.join(directory,"filelay")
  },

  getLayouts(request) {
    /*
      Scan the program for any Open statements and see which layouts are being opened and
      read those layouts to get the Subscripts from all of them.

      If the current context is you're in an fnOpen statement in the Quotes, then return a list
      of all valid layouts
    */
    var
      completions = [],
      [projectPath] = atom.project.relativizePath(request.editor.buffer.file.path)

    // Read the layout path
    if (this.infnOpen(request)) {

      // determine full layout folder path using current files project root
      for (layout in this.layoutList[projectPath]) {
        // console.log(items[i])
        completions.push({
          text: layout,
          type: 'constant',
          leftLabel: 'Layout'
        })
      }
      // completions = completions.concat(this.readLayoutList(layoutPath))
    } else {
      completions = this.readCurrentLayoutsDetails(request,path.join(projectPath,layoutPath))
    }
    return completions
  },

  readCurrentLayoutsDetails(request,layoutPath) {
    var completions = []
    var layouts = []
    request.editor.scan(FNOPEN_SEARCH,{
    },(match)=>{
      [wholeCall,layoutName] = match.match
      if (layouts.indexOf(layoutName.toLowerCase())<0) {
        // console.log(layoutName.toLowerCase())
        layouts.push(layoutName.toLowerCase())
      }
    })

    for (var i = 0; i < layouts.length; i++) {
      [projectPath] = atom.project.relativizePath(request.editor.buffer.file.path)
      var layout = this.layoutList[projectPath][layouts[i]]
      if (layout) {
        for (var s = 0; s < layout.subscripts.length; s++) {
          var subscript = layout.subscripts[s]
          var subscriptType = "Numeric Sub"
          if (subscript.name.includes("$")) {
            subscriptType = "String Sub"
          }
          var subname=layout.prefix + subscript.name.replace("$","")
          if (atom.config.get('language-br.lwrcLayoutSubscripts')) {
            subname=subname.toLowerCase()
          }

          completions.push({
            text: subname,
            displayText: subname,
            type: 'constant',
            leftLabel: subscriptType,
            // leftLabel: subscript.format,
            //snippet: layout.prefix + detailLine[0].replace("$",""),
            rightLabel: layouts[i] + " - " + subscript.name,
            // descriptionMoreURL: "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#Using_FileIO_in_Your_Programs"
            description: layouts[i] + " - " + subscript.line
          })
          // completions.push(this.layoutList[projectPath][i].subscripts[s])
        }
      }
    }
    return completions
  },

  infnOpen(request) {
    // examine the request and return true if we're in an fnOpen statement
    var priorText = request.editor.getTextInBufferRange([[request.bufferPosition.row,0],[request.bufferPosition.row,request.bufferPosition.column]])
    if (priorText.toLowerCase().includes('fnopen')) {
      return true;
    } else {
      return false;
    }
  },

  fnReadLayout(csvBuffer) {
    //Return Layout itself
    return Layout.parse(csvBuffer)
  },

  readLayoutPath(cb) {
    var layoutPath
    // open the fileio.ini file if found. Its either in a "fileio" folder or the root of the project.
    // read it looking for a "filelayout$=" statement and read everything that is on the right of the =
    // if not found, or if we can't find any of this, layout path defaults to "filelay"
    if (atom.workspace.project.contains(prog)){
      layoutPath="filelay"
    }

           // This should also read layout extension.
           // ! Read Custom Settings
           // if exists("fileio.ini") then
           //    execute Star$&"subproc fileio.ini"
           // else if exists("fileio\fileio.ini") then
           //    execute Star$&"subproc fileio\fileio.ini"
           // else if exists("\fileio.ini") then
           //    execute Star$&"subproc \fileio.ini"
           // end if
           //
    cb(layoutPath)
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
    var removedPrefix = false

    var editor = atom.workspace.getActiveTextEditor()
    var lines = editor.tokenizedBuffer.tokenizedLines
    var varlist = []
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]){
        let tokens = lines[i].tokens
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].scopes.indexOf("variable.br")>=0 || tokens[i].scopes.indexOf("variable.string.br")>=0){
            if (removedPrefix === false && tokens[i].value.toLowerCase() === request.prefix.toLowerCase()){
              removedPrefix = true
            } else {
              varlist.push(tokens[i].value)
            }
          }
        }
      }
    }
    varlist = varlist.unique()

    for (let i = 0; i < varlist.length; i++) {

      var type = varlist[i].includes('$') ? "String" : "Numeric"

      completions.push({
        text: varlist[i],
        type: 'variable',
        leftLabel: type
        // rightLabel: null,
        // description: description,
        // descriptionMoreURL:
        // displayText: description
      })
    }

    return completions
  },

  inLibraryStatement(request) {
    // examine the request and return true if we're in an fnOpen statement
    var priorText  = request.editor.getTextInBufferRange([[request.bufferPosition.row,0],[request.bufferPosition.row,request.bufferPosition.column]])
    if (CONTAINS_EXTERNAL_LIBRARY.test(priorText)) {
      return true;
    } else {
      return false;
    }
  },

  calculatePath(request,libraryPath) {
    [projectPath] = atom.project.relativizePath(request.editor.getPath())
    var libPath = path.join(projectPath, libraryPath.replace("\\","/"))
    return libPath
  },

  /*So in here, first we scan for any library statements
      in the program and build the list of files.
        We check if any of those files haven't been read yet.
        If not, we trigger a reading of the ones that haven't been read yet.

      If everything has been read, then
        Call a function to return them based on the request.
        if we are on a library line then
          return short completions of every function in the file
        else
          return long completions for all the functions listed in every library statement in the current program
        end if
      else
        spawn process reading them and launch promise
        promise needs to call the above functionality when done
      end if

    Old Description:
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

  readLibraryStatementPath(request) {
    // Reads the current line and if its a library statement, reads the path.
    var libraryStatementPath=""
    var priorText = request.editor.getTextInBufferRange([[request.bufferPosition.row,0],[request.bufferPosition.row,request.bufferPosition.column]])
    var libPath = priorText.match(CONTAINS_EXTERNAL_LIBRARY).groups.lib
    return libPath
  },

  getLibraryCompletions(request) {
    var completions = []
    // debugger
    if (this.inLibraryStatement(request)) {
      // Return completions for all library functions in the target file, with no parameters.
      var libPath = this.calculatePath(request,this.readLibraryStatementPath(request))
      var lib = this.loadedLibs[libPath]

      if (lib) {
        for (let func in lib.functions) {
          if (lib.functions.hasOwnProperty(func)) {
            var functionDescription = this.calculateDescription(lib.functions[func])

            var completion = {
              text: lib.functions[func].name,
              type: 'import',
              //snippet: func.name,
              //leftLabel: type,
              //rightLabel: null,
              description: functionDescription,
              // descriptionMoreURL:
              // displayText: description
            }
            completions.push(completion)
          }
        }
        return completions
      }
    } else {
      // Return completions for all functions listed in all library statements with parameters.
      request.editor.scan(LIBRARY_LINK_SEARCH,{
      },(match)=>{
        // for each thing found,
        // look up the function list and path to find the objects and return a detailed completion for each.
        var
          func,
          libPath = this.calculatePath(request,match.match.groups.lib),
          lib = this.loadedLibs[libPath],
          functionList = match.match.groups.functionList.split(','),
          name = ''

        if (lib){
          for (var i = 0; i < functionList.length; i++) {
            name = functionList[i].trim().toLowerCase()
            if (lib.functions.hasOwnProperty(name)){
              func = lib.functions[name]
              completions.push(func.completion)
            }
          }
        }
      })
    }
    return completions
  },
  generateSnippet(func){
    let snippet = func.name
    if (func.requiredParams.length && func.optionalParams.length) {
      snippet += "("
      for (var i = 0; i < func.requiredParams.length; i++) {
        snippet += '${'+(i+1)+':'+func.requiredParams[i]+'}'
        if (i<func.requiredParams.length-1){
          snippet += ","
        }
      }
      snippet += ","
      for (var i = 0; i < func.optionalParams.length; i++) {
        snippet += '${'+(i+func.requiredParams.length+1)+':'+func.optionalParams[i]+'}'
        if (i<func.optionalParams.length-1){
          snippet += ","
        }
      }
      snippet += ")"
    } else if (func.requiredParams.length) {
      snippet += "("
      for (var i = 0; i < func.requiredParams.length; i++) {
        snippet += '${'+(i+1)+':'+func.requiredParams[i]+'}'
        if (i<func.requiredParams.length-1){
          snippet += ","
        }
      }
      snippet += ")"
    } else if (func.optionalParams.length) {
      snippet += "("
      for (var i = 0; i < func.optionalParams.length; i++) {
        snippet += '${'+(i+1)+':'+func.optionalParams[i]+'}'
        if (i<func.optionalParams.length-1){
          snippet += ","
        }
      }
      snippet += ")"
    }
    // console.log(snippet);
    return snippet
  },

  calculateDescription(func) {
    var functionDescription = func.name
    if (func.requiredParams.length && func.optionalParams.length) {
      functionDescription = functionDescription + '(' + func.requiredParams.join(',') + ';' + func.optionalParams.join(',') + ')'
    } else if (func.requiredParams.length) {
      functionDescription = functionDescription + '(' + func.requiredParams.join(',') + ')'
    } else if (func.optionalParams.length) {
      functionDescription = functionDescription + '(;' + func.optionalParams.join(',') + ')'
    }

    return functionDescription
  },

  checkAndUpdateLibraries(request) {
    // Checks all layouts needed to see if we have them in memory.
    // if not, adds them to memory and returns a promise to run the getLibraryCompletions function.
    //  if so, just runs the getLibraryCompletions function.

    // create array to store list of libraries that need to be loaded
    var loadJobs = []

    // search for library statements in current program
    request.editor.scan(LIBRARY_LINK_CURRENT_SEARCH,{},(match)=>{
      // determine library's full path by combinig project root library path
      var libPath = this.calculatePath(request,match.match.groups.path.replace("\\","/"))

      // if library has not been loaded then
      if (this.loadedLibs[libPath]===undefined){
        // add to loadedList
        this.loadedLibs[libPath]={
          functions: []
        }

        // create promise that lib will be loaded
        loadJobs.push(new Promise((resolve)=>{
          var sourcePath = this.sourcePath(libPath)
          // check if we have read access
          fs.access(sourcePath, fs.constants.R_OK, (err) => {
            if (err){
              resolve(true)
            } else {
              fs.readFile(sourcePath,(err,contents)=>{
                var source = contents.toString()
                while (def = LIBRARY_REGEX.exec(source)) {
                  let libraryDefinition = {
                    name: def.groups.name,
                    requiredParams: [],
                    optionalParams: [],
                    completion: {
                      text: def.groups.name,
                      type: "function" ,
                      leftLabel: "Library Function",
                      snippet: "",
                      description: def[0]
                    }
                  }

                  if (def.groups.required){
                    libraryDefinition.requiredParams = def.groups.required.split(',')
                  }
                  if (def.groups.optionalTruncated){
                    libraryDefinition.optionalParams = def.groups.optionalTruncated.split(",")
                  }
                  if (def.groups.optional){
                    libraryDefinition.optionalParams = def.groups.optional.split(",")
                  }

                  // libraryDefinition.completion.description = this.calculateDescription(libraryDefinition)
                  libraryDefinition.completion.snippet = this.generateSnippet(libraryDefinition)

                  this.loadedLibs[libPath].functions[libraryDefinition.name.toLowerCase()] = libraryDefinition
                }

                resolve(true)
              })
            }
          });
        }))
      }

      // this.layoutList[projectPath][name] = Layout.parse(contents)
      //
      // path.join(layoutFolder,libPath)
      // if (match.match.groups.library)
      // var loadedLib
      // this.loadedLibs
      // [wholeCall,libraryPath] = match.match
      // if (libraryStatements.indexOf(libraryPath.toLowerCase())<0) {
      //   // console.log(layoutName.toLowerCase())
      //   libraryStatements.push(libraryPath.toLowerCase())
      // }

    })

    // if libraries need loading
    return Promise.all(loadJobs)
  },
  // function to get source filename from object filename
  sourcePath(objectPath) {
    var sourcePath = ""
    switch (path.extname(objectPath)) {
      case ".wb":
        sourcePath = path.dirname(objectPath)+"/"+path.basename(path.extname(objectPath),".wb")+".wbs"
        break;
      case ".br":
        sourcePath = path.dirname(objectPath)+"/"+path.basename(path.extname(objectPath),".br")+".brs"
        break;
      case "":
        sourcePath = objectPath+".brs"
        break;
      default:
      sourcePath = path.dirname(objectPath)+"/"+path.basename(objectPath, path.extname(objectPath))+".brs"
    }
    return sourcePath
  },
  loadLib(libPath){

  },
  parseParams(paramString, includeLocals = false){
    const paramList = paramString.replace(/^;|&|mat | /gi,"").replace(/^;/,"").split(/;|,/)

    if (paramList.indexOf("___")>=0){
      if (includeLocals){
        paramList.splice(paramList.indexOf("___"),1)
      } else {
        paramList.splice(paramList.indexOf("___"))
      }
    }

    return paramList
  },
  getFunctions(text, completions) {
    let
      def,
      name,
      stringChar,
      paramString

    while (func = FUNCTION_SEARCH.exec(text)){
      [def, name, stringChar, paramString] = func
      let
        paramList = this.parseParams(paramString),
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
        displayText: def
      })
    }

    // request.editor.scan(FUNCTION_SEARCH,{
    // },({match,matchText})=>{
    //
    //   let
    //     [name, paramString, stringChar] = match.groups,
    // })
    // //console.log("scan done");
    // return completions
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

  getTagDocsURL(tag){
    return `http://brwiki.brulescorp.com/index.php?search=${tag}`
  },
  onDidInsertSuggestion ({editor, suggestion}) {
    if (suggestion.type === 'attribute') {
      setTimeout(this.triggerAutocomplete.bind(this, editor), 1)
    }
  },

  triggerAutocomplete (editor) {
    // console.log("auto");
    // console.log(editor);
    atom.commands.dispatch(
      editor.getElement(),
      'autocomplete-plus:activate',
      {activatedManually: false}
    )
  }
}
