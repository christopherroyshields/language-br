const fs = require('fs');
const path = require("path")
const tmp = require('tmp');
const { exec } = require('child_process');
const { CompositeDisposable } = require('atom')
const { BrDebugServer } = require("./debugger.js")
const { objectPath, sourcePath } = require('./util.js');

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

  },

  compilex() {
    const request = require('request');
    const editor = atom.workspace.getActiveTextEditor()
    var formData = {
      source: fs.createReadStream(editor.getPath())
    }
    request.post({
      url: "http://192.168.7.50:3000/api/v1/compile",
      formData: formData
    }).on('error', (error)=>{
      atom.notifications.addError(`Error Connecting to LexiCloud: ${err.toString()}`);
    }).on('response',(response)=>{
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
    }).pipe(fs.createWriteStream(editor.getPath()+".br"))
  },

  compile(editor, sourcePath) {
    var lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi')
    var lexiCloud = atom.config.get('language-br.cloudLexi')
    if (lexiCloudEnabled){
      const request = require('request')
      atom.notifications.addInfo(`Compiling ${sourcePath}`);
      request.post({
        url:`http://${lexiCloud}:3000/api/v1/compile`,
        encoding: "binary",
        formData: {
          source: fs.createReadStream(sourcePath)
        }
      }, (err, res, body) => {

        if (err){
          atom.notifications.addError(`Error Connecting to LexiCloud: ${err.toString()}`);
          return
        }

        if (res.statusCode===400) {
          let brError = JSON.parse(body)
          atom.notifications.addError(`Compile Error\n ${brError.error} on line ${brError.lastLine+1}`);
          if (editor){
            editor.setCursorScreenPosition([brError.lastLine,1])
            editor.moveToEndOfLine()
            var marker = editor.markBufferRange([[brError.lastLine,0],[brError.lastLine,0]])
            // marker.decorateMarker("")
            var gutter = editor.gutterWithName('brErrors')
            if (!gutter){
              gutter = editor.addGutter({
                name: 'brErrors'
              });
            }
            gutter.decorateMarker(marker,{
              type: 'gutter',
              class: 'error-marker'
            })

          }
          return
        }

        var saveName = sourcePath.replace(/\.[^/.]+$/, "")+".br"
        if (path.extname(sourcePath)===".wbs"){
          saveName=".wb"
        }

        if (res.statusCode===200){
          fs.writeFile(saveName,body,'binary',(err)=>{
            if (err){
              atom.notifications.addError(`Could not save ${saveName}`);
            } else {
              atom.notifications.addInfo(`Compiled ${saveName} Successfully!`);
            }
          })
        }
      });
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

  activate(state) {
    this.matches = [];
    this.lastSearch = "";
    this.fromWord = false;
    this.disposables = new CompositeDisposable();
    this.lexiPath = path.normalize(__dirname+"\\..\\Lexi")

    this.autoCompileElement = document.createElement("a")
    this.autoCompileElement.classList.add("br-autocompile")
    this.autoCompileElement.classList.add("inline-block")
    this.autoCompileElement.innerText = "Auto-Compile Off"

    this.autoCompileElement.onclick = (e)=>{
      this.toggleAutoCompile()
    }

    // this.debugServer = new BrDebugServer()

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
            "command": "language-br:strip-line-numbers"
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
          editor = atom.workspace.getActiveTextEditor(),
          prog = editor.getPath()
          source = editor.getText()

        var newRefs = []
        source = source.replace(LINE_REFERENCE,(match, p1, p2)=>{
          var rep = ""
          let refList = p2.split(",")
          for (var i = 0; i < refList.length; i++) {
            let val = parseInt(refList[i])
            if (!Number.isNaN(val)){
              refList[i] = refList[i].replace(/\b\d{1,5}\b/,"L"+val.toString())
              if (newRefs.indexOf(val)===-1){
                newRefs.push(val)
              }
            }
          }
          return p1+refList.join(",")
        })

        source = source.replace(LINE_NUMBER,(match,p1,p2)=>{
          var val = parseInt(match)
          var rep = ''
          if (newRefs.indexOf(val)>=0){
            rep = match.replace(/\d{1,5} /gm,"L"+val.toString()+": ")
          } else {
            rep = match.replace(/\d{1,5} /gm,"")
          }
          return rep
        })

        editor.setText(source)
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-42': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${this.lexiPath}\\set42.cmd ${prog}`, {
            cwd: `${this.lexiPath}`
          });
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-43': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${this.lexiPath}\\set43.cmd ${prog}`, {
            cwd: `${this.lexiPath}`
          });
        }
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
        lexiCloud = atom.config.get('language-br.cloudLexi')

      if (prog && lexiCloudEnabled){
        if (path.extname(prog)===".br" || path.extname(prog)===".wb"){
          pane.destroyItem(textEditor)
          atom.workspace.open().then((editor)=>{
            const request = require('request');
            atom.notifications.addInfo(`Decompiling ${prog}`);
            request.post({
              url:`http://${lexiCloud}:3000/api/v1/decompile`,
              formData: {
                object: fs.createReadStream(prog)
              }
            }, function optionalCallback(err, httpResponse, body) {

              if (err) {
                atom.notifications.addError(`Decompile Failed!`);
                return console.error('upload failed:', err);
              }

              editor.setText(body)
              editor.setGrammar(atom.grammars.grammarForScopeName('.source.br'));

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