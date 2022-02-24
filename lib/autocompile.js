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

function show(){
  AutoCompileElement.classList.remove("hidden")
}

function hide(){
  AutoCompileElement.classList.add("hidden")
}

module.exports = {
  autoCompileElement: AutoCompileElement,
  toggle: toggleAutoCompile,
  init(compileDelegate){

    atom.workspace.observeTextEditors((editor) => {
      if (editor) {
        editor.onDidSave((event)=>{
          if (editor.autoCompile && isBrSource(editor) && editor == atom.workspace.getActiveTextEditor()){
            compileDelegate(editor)
          }
        })

        editor.observeGrammar(function(grammar) {
          editor.autoCompile = false
          if (grammar.scopeName === ".source.br"){
            show()
          } else {
            hide()
          }
        })
      }
    })

    atom.workspace.observeActiveTextEditor((editor) => {
      if (editor && isBrSource(editor)){
        show()
        if (editor.autoCompile){
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
