const path = require("path")
const { exec } = require('child_process');
const { CompositeDisposable } = require('atom')
const fs = require('fs');

const LINE_REFERENCE = /(?<keyword>attn|duprec|conv|eof|error|exit|goto|gosub|help|ioerr|locked|nokey|norec|oflow|pageoflow|soflow|using|zdiv)\s+(?<linenum>\d{1,5})/ig
const LINE_NUMBER = /^\s*\d+\s/gm

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

    "lexiMenuOnTop": {
      "description": "Include a Lexi menu at the top level Windows menu.",
      "type": "boolean",
      "default": "true",
    },
  },

  compile() {
    var pane = atom.workspace.getActivePane()
    var prog = pane.activeItem.getPath()
    var lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi')
    var lexiCloud = atom.config.get('language-br.cloudLexi')
    if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
      if (lexiCloudEnabled){
        const request = require('request');
        atom.notifications.addInfo(`Compiling ${prog}`);
        request.post({
          url:`http://${lexiCloud}:3000/api/v1/compile`,
          formData: {
            source: fs.createReadStream(prog)
          }
        }, function optionalCallback(err, httpResponse, body) {

          if (err) {
            return console.error('upload failed:', err);
          }

          var saveName = prog.replace(/\.[^/.]+$/, "")+".br"
          if (path.extname(prog)===".wbs"){
            saveName=".wb"
          }

          fs.writeFileSync(saveName,body)
          atom.notifications.addInfo(`Compile Successful! Saved: ${saveName}`);
          // httpResponse.pipe(wstream)
          // console.log("save file");

          // fs.writeFile(, 'Hello Node.js', 'utf8', callback);

        });
      } else {
        exec(`${this.lexiPath}\\ConvStoO.cmd ${prog}`, {
          cwd: `${this.lexiPath}`
        });
      }
    }
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

    atom.workspace.observeTextEditors((editor)=>{
      if (editor){
        editor.autoCompile = false
        var prog = editor.getPath()
        // check if brs file
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          editor.onDidSave((event)=>{
            var editor = atom.workspace.getActiveTextEditor()
            if (editor.autoCompile){
              this.compile()
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
          }
        ]
      }])
      atom.menu.update()
    }

    atom.commands.add('atom-workspace', {
      'language-br:compile': () => {
        this.compile()
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:debug': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${this.lexiPath}\\DebugBR.cmd ${prog}`, {
            cwd: `${this.lexiPath}`
          });
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
      'language-br:strip-line-numbers': () => {
        var
          editor = atom.workspace.getActiveTextEditor(),
          prog = editor.getPath()

        editor.scan(LINE_REFERENCE,{},({match,matchText,range,stop,replace})=>{
          var label = ''
          let {keyword,linenum} = match.groups
          label = 'L'+linenum.padStart(5,'0')
          replace(`${keyword} ${label}`)
          editor.scan(LINE_NUMBER,{},({match,matchText,range,stop,replace})=>{
            if (parseInt(matchText)===parseInt(linenum)){
              replace(`${label}: `)
            }
          })
        })

        editor.scan(LINE_NUMBER,{},({match,matchText,range,stop,replace})=>{
          replace(``)
        })
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
        // var pane = atom.workspace.getActivePane()
        // var prog = pane.activeItem.getPath()
        // if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${this.lexiPath}\\help.cmd ${selection}`, {
            cwd: `${this.lexiPath}`
          });
        // }
      }
    })

    atom.workspace.onDidAddPaneItem(({item,pane})=>{
      var
        prog = item.getPath(),
        text=''
        lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi')
        lexiCloud = atom.config.get('language-br.cloudLexi')

      // check if item is br file
      if (lexiCloudEnabled){
        if (path.extname(prog)===".br" || path.extname(prog)===".wb"){
          pane.destroyItem(item)
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
              editor.setGrammar(atom.grammars.grammarForScopeName('source.br'));

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

    if (selection.toLowerCase() !== this.lastSearch.toLowerCase()) {
      this.fromWord = false;
    }
    if (!selection) {
      this.editor.selectWordsContainingCursors();
      this.fromWord = true;
      selection = this.editor.getSelectedText();
    }

    if (!selection) {
      return;
    }
    selection = selection.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    this.lastSearch = selection;
    if (this.fromWord) {
      selection = '\\b' + selection + '\\b';
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
