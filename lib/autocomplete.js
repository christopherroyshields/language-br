const numeric_functions = require('../completions/numeric_functions');
const string_functions = require('../completions/string_functions');
const statements = require('../completions/statements');
const internalFunctions = numeric_functions.concat(string_functions).concat(statements);

const fileio = require('../completions/fileio')
const screenio = require('../completions/screenio')

const fs = require('fs')
const path = require('path');

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
    if (request.prefix.length>2){
      return new Promise((resolve)=>{
        var completions = []

        completions = completions.concat(this.getInternal(request))   // Get the Internal Functions and Statements
        completions = completions.concat(this.getFunctions(request))  // Get the Functions
        completions = completions.concat(this.getVariables(request))  // Get the Variables
        completions = completions.concat(this.getLibraryFunctions(request)) // Get the Library Functions
        if (atom.config.get('language-br.includeScreenioAutocomplete')) {
          completions = completions.concat(this.getScreenIO(request)) // Get the Standard Libraries
        }
        if (atom.config.get('language-br.includeFileioAutocomplete')) {
          completions = completions.concat(this.getFileIO(request)) // Get the Standard Libraries
        }

        this.getLayouts(request,(layouts)=>{
          // console.log(layouts);

          completions = completions.concat(layouts)
          resolve(completions)
        })
      })
    }
  },

  init(){
    //debugger
    console.log("init")
    this.layoutList = {}
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
          console.log("Skipping File: " + filepath)
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

  getLayouts(request,cb) {
    /*
      Scan the program for any Open statements and see which layouts are being opened and
      read those layouts to get the Subscripts from all of them.

      If the current context is you're in an fnOpen statement in the Quotes, then return a list
      of all valid layouts
    */
    [projectPath] = atom.project.relativizePath(request.editor.buffer.file.path)
    var completions = []
    // Read the layout path
    if (this.infnOpen(request)) {
      // determine full layout folder path using current files project root

      fs.readdir(path.join(projectPath,layoutPath), (err, items)=>{
        if (err){
          throw err
        } else {
          for (var i = 0; i < items.length; i++) {
            // console.log(items[i])
            completions.push({
              text: items[i],
              type: 'constant',
              leftLabel: 'Layout'
            })
          }
          cb(completions)
        }
      })
      // completions = completions.concat(this.readLayoutList(layoutPath))
    } else {
      cb(this.readCurrentLayoutsDetails(request,path.join(projectPath,layoutPath)))
    }
  },

  readCurrentLayoutsDetails(request,layoutPath) {
    var completions = []
    var layouts = []
    var search = /fnopen\(\"([\w|\d]*)\"/img
    request.editor.scan(search,{
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
      for (var s = 0; s < layout.subscripts.length; s++) {
        var subscript = layout.subscripts[s]
        var subscriptType = "Numeric Sub"
        if (subscript.name.includes("$")) {
          subscriptType = "String Sub"
        }
        completions.push({
          text: layout.prefix + subscript.name.replace("$",""),
          displayText: layout.prefix + subscript.name.replace("$",""),
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
    var priorText = request.editor.getTextInBufferRange([[request.bufferPosition.row,0],[request.bufferPosition.row,request.bufferPosition.column]])
    if (priorText.toLowerCase().includes('library')) {
      return true;
    } else {
      return false;
    }
  },

  getLibraryFunctions(request) {
    var completions = []

    /*
      So in here, first we scan for any library statements
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
    return completions
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

      var type = "numeric"
      if (stringChar) {
        type = "string"
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
