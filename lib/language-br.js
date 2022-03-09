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
const CloudLexi = require('./cloud-lexi.js');
const Occurence = require('./occurence.js');
const AutoComplete = require('./autocomplete')
const AutoCompile = require('./autocompile')

const LINE_BEGIN_SPACE = /(^) /gm

const LexiPath = path.normalize(__dirname+"\\..\\Lexi")

function compile(editor){
  let path = editor.getPath(),
  lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi')

  if (lexiCloudEnabled){
    CloudLexi.compile(editor, path)
  } else {
    exec(`${LexiPath}\\ConvStoO.cmd ${path}`, {
      cwd: `${LexiPath}`
    });
  }
}

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

        exec(`${LexiPath}\\brnative.exe "PROC :${procPath}"`, {
          cwd: `${projectPath}`
        })
        // cleanupCallback();
      })
    });

  },

  consumeStatusBar(statusBar) {
    statusBar.addRightTile({
      item: AutoCompile.autoCompileElement,
      visible: false
    })

    statusBar.addRightTile({
      item: CloudLexi.compileStatusIcon,
      visible: true
    })
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
    this.disposables = new CompositeDisposable();
    this.subscriptions = new CompositeDisposable();

    this.functionHint = new FunctionHint()

    AutoCompile.init((state !== undefined && state.AutoCompileState !== undefined) ? state.AutoCompileState : {}, compile)

    atom.workspace.onDidAddTextEditor(({textEditor,pane,index})=>{
      let
        prog = textEditor.getPath(),
        lexiCloudEnabled = atom.config.get('language-br.enableCloudLexi')

      if (prog && lexiCloudEnabled){
        if (path.extname(prog)===".br" || path.extname(prog)===".wb"){
          pane.destroyItem(textEditor)
          atom.workspace.open().then((editor)=>{
            atom.notifications.addInfo(`Decompiling ${prog}`);
            CloudLexi.decompile(prog, editor);
          })
        }
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
      'language-br:debug': () => {
        let
          editor = atom.workspace.getActiveTextEditor(),
          sourcePath = editor.getPath(),
          [projectPath] = atom.project.relativizePath(sourcePath)

        if (path.extname(sourcePath)===".brs" || path.extname(sourcePath)===".wbs"){
          this.debug(sourcePath)
        }
      }
    })

    atom.commands.add('atom-text-editor[data-grammar=" source br"]', {
      'language-br:toggle-auto-compile': function() {
        AutoCompile.toggle(this.getModel())
      }
    })

    atom.commands.add('atom-text-editor', {
      'next-occurrence:next': function() {
        Occurence.next(this.getModel());
      },
      'next-occurrence:prev': function() {
        Occurence.prev(this.getModel());
      }
    })

    atom.commands.add('atom-text-editor[data-grammar=" source br"]', {
      'language-br:compile': function() {
        let editor = this.getModel()
        if (AutoCompile.enabled(editor)){
          editor.save()
        } else {
          editor.save().then(r=>{compile(editor)})
        }
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:run': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${LexiPath}\\RunBR.cmd ${prog}`, {
            cwd: `${LexiPath}`
          });
        }
      }
    })

    atom.commands.add('atom-text-editor[data-grammar=" source br"]', {
      'language-br:add-line-numbers': function() {
        let
          editor = this.getModel(),
          prog = editor.getPath()

        LineNumbers.addLineNumbers(editor)

        // exec(`${LexiPath}\\AddLN.cmd ${prog}`, {
        //   cwd: `${LexiPath}`
        // });
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:lexi-strip-line-numbers': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`${LexiPath}\\StripLN.cmd ${prog}`, {
            cwd: `${LexiPath}`
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
        exec(`${LexiPath}\\set41.cmd`, {
          cwd: `${LexiPath}`
        });
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-42': () => {
        exec(`${LexiPath}\\set42.cmd`, {
          cwd: `${LexiPath}`
        });
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:set-br-43': () => {
        exec(`${LexiPath}\\set43.cmd`, {
          cwd: `${LexiPath}`
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

        exec(`${LexiPath}\\help.cmd ${selection}`, {
          cwd: `${LexiPath}`
        });
      }
    })
  },

  serialize() {
    return {
      AutoCompileState: AutoCompile.getState()
    }
  },

  deactivate() {
    return this.disposables.dispose()
  }
}
