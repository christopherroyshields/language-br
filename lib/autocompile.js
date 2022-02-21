const { isBrSource } = require('./util.js');

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

function toggleAutoCompile(editor){
  if (editor.autoCompile){
    editor.autoCompile = false;
    autoCompileShowDisabled()
  } else {
    editor.autoCompile = true;
    autoCompileShowEnabled()
  }
}

module.exports = {
  autoCompileElement: AutoCompileElement,
  toggle: toggleAutoCompile,
  init(compileDelegate){

    atom.workspace.observeTextEditors((editor) => {
      if (editor) {
        editor.observeGrammar(function(grammar) {
          if (grammar.scopeName === ".source.br"){
            editor.autoCompile = false
            editor.onDidSave((event)=>{
              if (editor.autoCompile){
                compileDelegate(editor)
              }
            })
          }
        })
      }
    })

    atom.workspace.observeActiveTextEditor((editor) => {
      if (editor){
        if (isBrSource(editor)){
          AutoCompileElement.classList.remove("hidden")
          if (editor.autoCompile){
            autoCompileShowEnabled()
          } else {
            autoCompileShowDisabled()
          }
        } else {
          AutoCompileElement.classList.add("hidden")
        }
      }
    })

  }
}
