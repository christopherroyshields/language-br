const { isBrSource } = require('./util.js');

let AutoCompileEnabledState

const AutoCompileElement = document.createElement("a")
AutoCompileElement.classList.add("br-autocompile")
AutoCompileElement.classList.add("inline-block")
AutoCompileElement.innerText = "Auto-Compile Off"

AutoCompileElement.onclick = (e) => {
  toggleAutoCompile(atom.workspace.getActiveTextEditor())
}

function autoCompileShowDisabled(){
  AutoCompileElement.innerText = "Auto-Compile Off"
  AutoCompileElement.classList.remove("active")
}

function autoCompileShowEnabled(){
  AutoCompileElement.innerText = "Auto-Compile On"
  AutoCompileElement.classList.add("active")
}

function autoCompileEnabled(editor) {
  let filePath = editor.getPath()
  if (!AutoCompileEnabledState.hasOwnProperty(filePath)){
    AutoCompileEnabledState[filePath] = {
      enabled: false,
      lastAccessed: Date.now()
    }
  } else {
    AutoCompileEnabledState[filePath].lastAccessed = Date.now()
  }
  return AutoCompileEnabledState[filePath].enabled
}

function toggleAutoCompile(editor){
  let filePath = editor.getPath()
  if (autoCompileEnabled(editor)){
    AutoCompileEnabledState[filePath].enabled = false;
    autoCompileShowDisabled()
  } else {
    AutoCompileEnabledState[filePath].enabled = true;
    autoCompileShowEnabled()
  }
}

function show(){
  AutoCompileElement.classList.remove("hidden")
}

function hide(){
  AutoCompileElement.classList.add("hidden")
}

module.exports = {
  autoCompileElement: AutoCompileElement,
  toggle: toggleAutoCompile,
  getState() {
    return AutoCompileEnabledState
  },
  init(state, compileDelegate){

    AutoCompileEnabledState = state

    // remove file states older than 30 days
    let oldestAllowedState  = new Date(Date.now() - (24*60*60*1000) * 30)
    for (var file in AutoCompileEnabledState) {
      if (AutoCompileEnabledState.hasOwnProperty(file)) {
        if (AutoCompileEnabledState[file].lastAccessed < oldestAllowedState) {
          delete AutoCompileEnabledState[file]
        }
      }
    }

    atom.workspace.observeTextEditors((editor) => {
      if (editor) {
        editor.onDidSave((event)=>{
          if (isBrSource(editor) && editor == atom.workspace.getActiveTextEditor() && autoCompileEnabled(editor)){
            compileDelegate(editor)
          }
        })

        editor.observeGrammar(function(grammar) {
          if (grammar.scopeName === ".source.br"){
            show()
            if (autoCompileEnabled(editor)){
              autoCompileShowEnabled()
            } else {
              autoCompileShowDisabled()
            }
          } else {
            hide()
          }
        })
      }
    })

    atom.workspace.observeActiveTextEditor((editor) => {
      if (editor && isBrSource(editor)){
        show()
        if (autoCompileEnabled(editor)){
          autoCompileShowEnabled()
        } else {
          autoCompileShowDisabled()
        }
      } else {
        hide()
      }
    })

  }
}
