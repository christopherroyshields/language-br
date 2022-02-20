const fs = require('fs');
const path = require("path")
const tmp = require('tmp');
const os = require('os');
const { exec } = require('child_process');
const { CompositeDisposable } = require('atom')
const { BrDebugServer } = require("./debugger.js")
const { objectPath, sourcePath, isBrSource } = require('./util.js');
const FunctionHint = require("./function-hint.js")
const LineNumbers = require("./line-numbers.js")

const LINE_REFERENCE = /(?<keyword>attn|duprec|conv|eof|error|exit|goto|gosub|help|ioerr|locked|nokey|norec|oflow|pageoflow|soflow|using|zdiv|none)(?<refs>[ ]+\w+(?:,[ ]*\w+[ ]*)*)/ig
const LINE_NUMBER = /^\s*\d+\s/gm
const LINE_BEGIN_SPACE = /(^) /gm

const AutoComplete = require('./autocomplete')

module.exports = {
  getProvider(){
    // console.log("getProvider");
    AutoComplete.init();
    return AutoComplete
  },
  config: {
    "enableCloudLexi": {
      "description": "Enable Experimental Lexi Server",
      "type": "boolean",
      "default": false
    },

    "cloudLexi": {
      "description": "Lexi Web API Server Address",
      "type": "string",
      "default": "cloudlexi.com"
    },

    "cloudLexiHttps": {
      "description": "Lexi Web API - Use HTTPS",
      "type": "boolean",
      "default": false
    },

    "searchBling": {
      "description": "Flashy Border Animations identifying the location of other matches, when walking through the code using Shift-Ctrl-Up or Shift-Ctrl-Dn.",
      "type": "boolean",
      "default": true
    },

    "searchSound": {
      "description": "Sound when the search hits the end and can't search no moe, when walking through the code using Shift-Ctrl-Up or Shift-Ctrl-Dn.",
      "type": "boolean",
      "default": true
    },


    "includeInternalAutocomplete": {
      "description": "Include Internal Statements and Functions Autocompletions.",
      "type": "boolean",
      "default": true
    },

    "includeFunctionAutocomplete": {
      "description": "Include Autocompletions for all the Local Functions used in your program.",
      "type": "boolean",
      "default": true
    },

    "includeVariableAutocomplete": {
      "description": "Include Autocompletions for the Variables used in your program.",
      "type": "boolean",
      "default": true
    },

    "includeFileioAutocomplete": {
      "description": "Include FileIO Code Autocompletions.",
      "type": "boolean",
      "default": true
    },

    "includeScreenioAutocomplete": {
      "description": "Include ScreenIO Code completions.",
      "type": "boolean",
      "default": true
    },

    "includeLibraryAutocomplete": {
      "description": "Include Autocompletions generated from your Libraries.",
      "type": "boolean",
      "default": "true",
    },

    "includeLayoutAutocomplete": {
      "description": "Include Autocompletions generated from your File Layouts.",
      "type": "boolean",
      "default": "true",
    },

    "lwrcLayoutSubscripts": {
      "description": "Lowercase the Subscript Autocompletions generated from your File Layouts.",
      "type": "boolean",
      "default": "true",
    },

    "lexiMenuOnTop": {
      "description": "Include a Lexi menu at the top level Windows menu.",
      "type": "boolean",
      "default": "true",
    },

    "functionHintEnabled": {
      "description": "Enable function hints to display parameters for current function.",
      "type": "boolean",
      "default": "true",
    }

  },

  cloudCompile(editor, sourcePath){
    this.compileStatus.classList.add("rotating")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "lines": editor.getBuffer().getLines()
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    var lexiUrl = atom.config.get('language-br.cloudLexi');
    var protocol = atom.config.get('language-br.cloudLexiHttps') ? "https": "http";

    if (editor.errmarker){
        editor.errmarker.destroy()
    }

    fetch(`${protocol}://${lexiUrl}/compile`, requestOptions)
      .then(response => response.text())
      .then(result => {
        var {
          error,
          bin,
          line,
          message,
          sourceLine,
          sourceLineEnd,
        } = JSON.parse(result)

        this.compileStatus.classList.remove("rotating")

        if (bin && !error){
          var binPath = this.compiledPath(sourcePath)
          fs.writeFile(binPath, Buffer.from(bin, 'base64'), ()=>{
            atom.notifications.addInfo(`Compiled ${binPath} Successfully!`, {
              dismissable: true
            });
          })
          setTimeout(a=>{
            atom.notifications.getNotifications().forEach( n => n.dismiss() );
          }, 1000);
        }

        if (error && !bin){
          atom.notifications.addError(`Error ${error}<a href="http://brwiki2.brulescorp.com/index.php?title=${error}">&#128279;</a> on line ${sourceLine}.`, {
            dismissable: true,
            detail: message
          })
          if (sourceLine){
            editor.setCursorBufferPosition([sourceLineEnd-1,1])
            editor.moveToEndOfLine()
            var startLineText = editor.lineTextForBufferRow(sourceLine-1)
            var lastLineText = editor.lineTextForBufferRow(sourceLineEnd-1)

            editor.errmarker = editor.markBufferRange([
              [
                sourceLine-1,
                startLineText.search(/[^ ]/)
              ],
              [
                sourceLineEnd-1,
                lastLineText.length
              ]
            ])

            editor.decorateMarker(editor.errmarker, {
              class: 'error-marker',
              type: 'highlight'
            });
          }
          setTimeout(a=>{
            atom.notifications.getNotifications().forEach( n => n.dismiss() );
          }, 10000);
        }

        if (error && bin){
          atom.notifications.addWarning(`Error ${error}<a href="http://brwiki2.brulescorp.com/index.php?title=${error}">&#128279;</a> on line ${sourceLine}.`, {
            dismissable: true,
            detail: message
          })
          setTimeout(a=>{
            atom.notifications.getNotifications().forEach( n => n.dismiss() );
          }, 4000);
        }


      })
      .catch(error => {
        var message =  `URL: at ${protocol}://${lexiUrl}/compile\n${error.message}`
        atom.notifications.addError(`Error Connecting to Lexicloud`, {
          dismissable: true,
          detail: message
        })

        setTimeout(a=>{
          atom.notifications.getNotifications().forEach( n => n.dismiss() );
        }, 5000);

        this.compileStatus.classList.remove("rotating")

        throw error
      });
  },

  compiledPath(sourcePath){
    var ext = ".br"
    if (path.extname(sourcePath)===".wbs"){
      ext = ".wb"
    }
    return path.join(path.dirname(sourcePath), path.basename(sourcePath, path.extname(sourcePath)) + ext)
  },

  compile(editor, sourcePath) {
    var lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi')
    var lexiCloud = atom.config.get('language-br.cloudLexi')
    if (lexiCloudEnabled){
      this.cloudCompile(editor, sourcePath)
    } else {
      exec(`${this.lexiPath}\\ConvStoO.cmd ${sourcePath}`, {
        cwd: `${this.lexiPath}`
      });
    }
  },

  debug(source){
    let proc = [
      `load ":${objectPath(source)}"`,
      `debug connect 127.0.0.1`,
      `run >DEBUG:`
    ].join('\n')

    tmp.file({
      postfix: '.$$$'
    }, (err, procPath, fd, cleanupCallback) => {
      if (err) throw err;

      fs.writeFile(fd, proc, (err)=>{
        if (err) throw err;

        exec(`${this.lexiPath}\\brnative.exe "PROC :${procPath}"`, {
          cwd: `${projectPath}`
        })
        // cleanupCallback();
      })
    });

  },

  consumeStatusBar(statusBar) {
    this.autoCompileTile = statusBar.addRightTile({
      item: this.autoCompileElement,
      visible:false
    })
    this.compilingTile = statusBar.addRightTile({
      item: this.compileStatus,
      visible: true
    })
  },

  autoCompileShowDisabled(){
    this.autoCompileElement.innerText = "Auto-Compile Off"
    this.autoCompileElement.classList.remove("active")
  },

  autoCompileShowEnabled(){
    this.autoCompileElement.innerText = "Auto-Compile On"
    this.autoCompileElement.classList.add("active")
  },

  toggleAutoCompile(){
    var editor = atom.workspace.getActiveTextEditor()
    if (editor.autoCompile){
      editor.autoCompile = false;
      this.autoCompileShowDisabled()
    } else {
      editor.autoCompile = true;
      this.autoCompileShowEnabled()
    }
  },

  compiling(){
    var editor = atom.workspace.getActiveTextEditor()
    if (editor.autoCompile){
      editor.autoCompile = false;
      this.autoCompileShowDisabled()
    } else {
      editor.autoCompile = true;
      this.autoCompileShowEnabled()
    }
  },

  activate(state) {
    this.matches = [];
    this.lastSearch = "";
    this.fromWord = false;
    this.disposables = new CompositeDisposable();
    this.subscriptions = new CompositeDisposable();
    this.lexiPath = path.normalize(__dirname+"\\..\\Lexi")

    this.autoCompileElement = document.createElement("a")
    this.autoCompileElement.classList.add("br-autocompile")
    this.autoCompileElement.classList.add("inline-block")
    this.autoCompileElement.innerText = "Auto-Compile Off"

    this.autoCompileElement.onclick = (e)=>{
      this.toggleAutoCompile()
    }

    this.compileStatus = document.createElement("span")
    this.compileStatus.classList.add("icon", "icon-repo-sync", "compileStatus")
    //this.compileStatus.classList.add("inline-block")
    //this.compileStatus.innerText = "Auto-Compile Off"

    // this.console.error();
    // this.debugServer = new BrDebugServer()
    this.functionHint = new FunctionHint()

    atom.commands.add('atom-workspace', {
      'language-br:debug': () => {
        let
          editor = atom.workspace.getActiveTextEditor(),
          sourcePath = editor.getPath(),
          [projectPath] = atom.project.relativizePath(sourcePath)

        if (path.extname(sourcePath)===".brs" || path.extname(sourcePath)===".wbs"){
          // this.lexiPath = path.normalize(__dirname+"\\..\\Lexi")
          this.debug(sourcePath)
        }
      }
    })

    atom.workspace.observeTextEditors((editor)=>{
      if (editor){
        editor.autoCompile = false
        var prog = editor.getPath()
        // check if brs file
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          editor.errmarker = null;
          editor.onDidSave((event)=>{
            // var editor = atom.workspace.getActiveTextEditor()
            if (editor.autoCompile){
              this.compile(editor, prog)
            }
          })
        }
      }
    })

    atom.workspace.observeActiveTextEditor((editor)=>{
      var editor = atom.workspace.getActiveTextEditor()
      if (editor){
        var prog = editor.getPath()
        // check if brs file
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          this.autoCompileElement.classList.remove("hidden")

          if (editor.autoCompile){
            this.autoCompileShowEnabled()
          } else {
            this.autoCompileShowDisabled()
          }

        } else {
          this.autoCompileElement.classList.add("hidden")
        }
      }
    })

    atom.commands.add('atom-text-editor', {
      'language-br:toggle-auto-compile': () => {
        this.toggleAutoCompile();
      }
    })

    atom.commands.add('atom-text-editor', {
      'next-occurrence:next': () => {
        this.init();
        return this.next();
      },
      'next-occurrence:prev': () => {
        this.init();
        return this.prev();
      }
    })

    if (atom.config.get("language-br.lexiMenuOnTop")){
      atom.menu.add([{
        "label": "Lexi",
        "submenu": [
          {
            "label": "Compile BR Program",
            "command": "language-br:compile"
          },
          {
            "label": "Debug BR Program",
            "command": "language-br:debug"
          },
          {
            "label": "Run BR Program",
            "command": "language-br:run"
          },
          {
            "label": "Add Line Numbers",
            "command": "language-br:add-line-numbers"
          },
          {
            "label": "Remove Line Numbers",
            "command": "language-br:lexi-strip-line-numbers"
          },
          {
            "label": "Set BR 4.1",
            "command": "language-br:set-br-41"
          },
          {
            "label": "Set BR 4.2",
            "command": "language-br:set-br-42"
          },
          {
            "label": "Set BR 4.3",
            "command": "language-br:set-br-43"
          },
          {
            "label": "Search Wiki for Selected Text",
            "command": "language-br:lookupwiki"
          },
          {
            "label": "Fix Tab Spacing",
            "command": "language-br:fix-tabs"
          }
        ]
      }])
      atom.menu.update()
    }

    atom.commands.add('atom-workspace', {
      'language-br:compile': () => {
        let
          editor = atom.workspace.getActiveTextEditor(),
          isBrSource = editor.getRootScopeDescriptor().scopes.includes(".source.br"),
          sourcePath = editor.getPath()

        if (isBrSource){
          editor.save()
          this.compile(editor,sourcePath)
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:run': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${this.lexiPath}\\RunBR.cmd ${prog}`, {
            cwd: `${this.lexiPath}`
          });
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:add-line-numbers': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          var lexiPath = path.normalize(__dirname+"\\..\\Lexi")
          exec(`${lexiPath}\\AddLN.cmd ${prog}`, {
            cwd: `${lexiPath}`
          });
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:lexi-strip-line-numbers': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          var lexiPath = path.normalize(__dirname+"\\..\\Lexi")
          exec(`${lexiPath}\\StripLN.cmd ${prog}`, {
            cwd: `${lexiPath}`
          });
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:fix-tabs': () => {
        let
          editor = atom.workspace.getActiveTextEditor(),
          prog = editor.getPath(),
          source = editor.getText()

        source = source.replace(LINE_BEGIN_SPACE,"$1")
        editor.setText(source)
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:strip-line-numbers': () => {
        var
          editor = atom.workspace.getActiveTextEditor()

        try {
          LineNumbers.removeLineNumbers(editor);
        } catch(err) {
          atom.notifications.addError("Error removing line numbers.", {
            detail : err.message
          })
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-41': () => {
        exec(`${this.lexiPath}\\set41.cmd`, {
          cwd: `${this.lexiPath}`
        });
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-42': () => {
        exec(`${this.lexiPath}\\set42.cmd`, {
          cwd: `${this.lexiPath}`
        });
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-43': () => {
        exec(`${this.lexiPath}\\set43.cmd`, {
          cwd: `${this.lexiPath}`
        });
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:lookupwiki': () => {
        var selection;
        this.editor = atom.workspace.getActiveTextEditor();
        selection = this.editor.getSelectedText();
        if (!selection) {
          this.editor.selectWordsContainingCursors();
          this.fromWord = true;
          selection = this.editor.getSelectedText();
        }

        exec(`${this.lexiPath}\\help.cmd ${selection}`, {
          cwd: `${this.lexiPath}`
        });
      }
    })

    atom.workspace.onDidAddTextEditor(({textEditor,pane,index})=>{
      let
        prog = textEditor.getPath(),
        lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi'),
        lexiCloud = atom.config.get('language-br.cloudLexi'),
        protocol = atom.config.get('language-br.cloudLexiHttps') ? "https": "http"

      if (prog && lexiCloudEnabled){
        if (path.extname(prog)===".br" || path.extname(prog)===".wb"){
          pane.destroyItem(textEditor)
          atom.workspace.open().then((editor)=>{
            atom.notifications.addInfo(`Decompiling ${prog}`);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
              "bin": fs.readFileSync(prog, 'base64')
            });

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };

            fetch(`${protocol}://${lexiCloud}/decompile`, requestOptions)
              .then(response => response.text())
              .then(result => {
                var resultObj = JSON.parse(result)
                editor.setText(resultObj.lines.join(os.EOL))
                editor.setGrammar(atom.grammars.grammarForScopeName('.source.br'))
              })
              .catch(error => {
                console.error('error', error)
                atom.notifications.addError(`Failed to decompile ${prog}`);
              });

          })
        }
      }
    })

  },
  handleURI (parsedUri) {
    console.log(parsedUri)
  },

  deactivate() {
    return this.disposables.dispose()
  },

  init() {
    var selection;
    this.editor = atom.workspace.getActiveTextEditor();
    selection = this.editor.getSelectedText();

    this.matches = [];

    selection = selection.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (selection.toLowerCase() !== this.lastSearch.toLowerCase()) {
      this.fromWord = false;
    } else {
      this.lastSearch = selection;
    }

    if (!selection) {
      this.editor.selectWordsContainingCursors();
      this.fromWord = true;
      selection = this.editor.getSelectedText();
      selection = selection.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      this.lastSearch = selection;
    }

    if (!selection) {
      return;
    }

    if (this.fromWord) {
      if (selection.slice(-1) === '$') {
        selection = '\\b' + selection
      } else {
        selection = '\\b' + selection + '(\\b|\\n)(?!\\$)';
      }
    }
    return this.editor.scan(new RegExp(selection, 'gi'), (o) => {

      if (atom.config.get('language-br.searchBling')) {
        o.marker = this.editor.markBufferRange(o.range, {
          invalidate: 'never'
        })

        o.decorator = this.editor.decorateMarker(o.marker, {
          type: "text",
          class: "occurence"
        })

        setTimeout(function () {
          o.marker.destroy()
        }, 500);
      }
      return this.matches.push(o);
    });
  },

  after(p1, p2, strict = true) {
    return p1.row === p2.row && (strict ? p1.column > p2.column : p1.column >= p2.column) || p1.row > p2.row;
  },

  next() {
    var cursor, match, ref;
    if (!(match = (ref = this.matches.slice(-1)[0]) != null ? ref.range.start : void 0)) {
      return;
    }

    cursor = this.editor.getCursorBufferPosition();
    if (this.after(cursor, match, false)) {
      // cursor =
      //   column: 0
      //   row: 0
      if (atom.config.get('language-br.searchBling')) {
         ref.decorator.setProperties({type: 'text', class: 'occurence-current-big'})
         // this.animateSelection('occurence-current-big')
      }

      if (atom.config.get('language-br.searchSound')) {
         return atom.beep();
      }
    } else {
      return this.lookup(cursor, 1);
    }
    this.disposables.dispose()
  },
  prev() {
    var cursor, match, ref;
    if (!(match = (ref = this.matches[0]) != null ? ref.range.end : void 0)) {
      return;
    }
    cursor = this.editor.getCursorBufferPosition();
    if (this.after(match, cursor, false)) {
      // cursor = @editor.getEofBufferPosition()

      if (atom.config.get('language-br.searchBling')) {
        // this.animateSelection('occurence-current-big')
        ref.decorator.setProperties({type: 'text', class: 'occurence-current-big'})
      }
      if (atom.config.get('language-br.searchSound')) {
        return atom.beep();
      }
    } else {

      return this.lookup(cursor, -1);
    }
  },
  lookup(cursor, step) {
    var i, len, match, ref, ref1, results;
    if (!this.matches.length) {
      return;
    }
    ref1 = this.matches;
    ref = step;
    results = [];
    for ((ref > 0 ? (i = 0, len = ref1.length) : i = ref1.length - 1); ref > 0 ? i < len : i >= 0; i += ref) {
      match = ref1[i];
      match = match.range;
      if ((step === 1 && this.after(match.start, cursor)) || (step === -1 && this.after(cursor, match.end))) {
        this.editor.setCursorBufferPosition([match.start.row, match.start.column]);
        this.editor.addSelectionForBufferRange([[match.start.row, match.start.column], [match.end.row, match.end.column]]);
        if (atom.config.get('language-br.searchBling')) {
          this.matches[i].decorator.setProperties({type: 'text', class: 'occurence-current'})
        }
        break;
      }
    }
  }
}
