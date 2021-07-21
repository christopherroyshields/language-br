const numeric_functions = require('../completions/numeric_functions');
const string_functions = require('../completions/string_functions');
const internalFunctions = numeric_functions.concat(string_functions);

const { objectPath, sourcePath, isBrSource, getFunctions } = require('./util.js');
const {CompositeDisposable, Disposable} = require('atom');
const CONTAINS_BALANCED_FN = /[a-zA-Z][a-zA-Z0-9_]*?\$?\([ ,0-9a-z]*\)/g

class FunctionHintElement extends HTMLElement {
  constructor() {
    super();
    this._functionName = null;
    this._params = [];
    this._param = 0;
  }

  static get observedAttributes() { return ["name", "params", "param"]; }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "name":
        this._functionName = newValue;
        break;
      case "params":
        this._params = newValue.split(",");
        break;
      case "param":
        this._param = newValue;
        break;
    }
    this._updateRendering();
  }
  connectedCallback() {
    this._updateRendering();
  }

  get name() {
    return this._functionName;
  }

  set name(v) {
    this.setAttribute("name", v);
  }

  get params(){
    return this._params
  }

  set params(v){
    this.setAttribute("params", v.join(","));
  }

  get param(){
    return this._param
  }

  set param(v){
    this.setAttribute("param", v);
  }

  _updateRendering() {
    // Left as an exercise for the reader. But, you'll probably want to
    // check this.ownerDocument.defaultView to see if we've been
    // inserted into a document with a browsing context, and avoid
    // doing any work if not.
    //console.log("render: " + this.name);
    // this.innerHTML = `${this.name}(${this.params.join(",")})`
    this.innerHTML = ""
    this.insertAdjacentText('beforeend', `${ this.name }(`)
    for (var f = 0; f < this.params.length; f++) {
      if (f){
        this.insertAdjacentText('beforeend', ",")
      }
      if (f == this.param){
        var paramEl = document.createElement("span")
        paramEl.innerText = this.params[f]
        paramEl.classList.add("current-param")
        this.insertAdjacentElement("beforeEnd", paramEl)
      } else {
        this.insertAdjacentText('beforeend', this.params[f])
      }
    }
    this.insertAdjacentText('beforeend', ")")
  }
}

module.exports =
class FunctionHint {
  constructor(){

    customElements.define("function-hint", FunctionHintElement);

    this.hintEl = document.createElement("function-hint")
    this.autoCompleteHintEl = document.createElement("function-hint")

    this.detachedHintDecoration = null

    atom.workspace.observeTextEditors((editor)=>{
      if (editor){
        this.watchEditor(editor)
      }
    })

    atom.commands.add('atom-workspace', {
      'language-br:toggle-function-hint': () => {
        if (atom.config.get("language-br.functionHintEnabled")){
          this.hide();
          atom.config.set("language-br.functionHintEnabled", false)
        } else {
          atom.config.set("language-br.functionHintEnabled", true)
          let editor = atom.workspace.getActiveTextEditor()
          if (editor){
            this.watchEditor(editor)
          }
        }
      }
    })
  }
  watchEditor(editor){
    const cursor = editor.getLastCursor()

    let view = atom.views.getView(editor)
    if (view.hasFocus()) {
      const bufferPosition = cursor.getBufferPosition()
      this.showFunctionHint(editor, bufferPosition)
    }

    let blurListener = (element) => this.hide()
    view.addEventListener('blur', blurListener)

    cursor.onDidChangePosition((e)=>{
      this.showFunctionHint(editor, e.newBufferPosition)
    })

    cursor.onDidDestroy((e)=>{
      this.hide()
    })
  }

  showFunctionHint(editor, bufferPosition){
    this.hide()
    if (atom.config.get("language-br.functionHintEnabled")){
      const call = this.getFunctionDetails(editor, bufferPosition)
      if (call.name){
        this.hintEl.name = call.name
        this.hintEl.params = call.params
        this.hintEl.param = call.param

        var currentParam = this.hintEl.querySelector('.current-param')
        if (currentParam){
          // this.hintEl.style.marginLeft = "0";
          this.hintEl.style.marginLeft = "-" + currentParam.offsetLeft + "px";
        }

        this.autoCompleteHintEl.name = call.name
        this.autoCompleteHintEl.params = call.params
        this.autoCompleteHintEl.param = call.param

        const editorElement = atom.views.getView(editor)
        if (editorElement && editorElement.classList) {
          editorElement.classList.add('function-hint-active')
        }

        this.attachedHintElement = atom.packages.getLoadedPackage("autocomplete-plus").mainModule.autocompleteManager.suggestionList.suggestionListElement.element.insertAdjacentElement("afterbegin", this.autoCompleteHintEl)
        this.autoCompleteHintEl.style.display = "";

        this.detachedHintDecoration = editor.decorateMarker(editor.getLastCursor().getMarker(), {
          type: "overlay",
          class: "detached-function-hint",
          item: this.hintEl
        })
      }
    }
  }

  hide(){

    if (this.detachedHintDecoration){
      this.detachedHintDecoration.destroy()
      this.detachedHintDecoration = null
    }

    this.autoCompleteHintEl.style.display = "none"

  }

  stripBalancedFunctions(line){
    if (CONTAINS_BALANCED_FN.test(line)){
      line = line.replace(CONTAINS_BALANCED_FN, "")
      line = this.stripBalancedFunctions(line)
    }
    return line
  }

  getFunctionDetails(editor, bufferPosition){

    let
      name = "",
      call = {
        name : "",
        param : 0
      }

    let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])

    // strip functions with params
    if (line){
      line = this.stripBalancedFunctions(line)
      var fnStart = line.search(/[a-zA-Z][a-zA-Z0-9_]*?\$?(?:\()[^(]*$/)
      if (fnStart >=0 ){
        name = line.substring(fnStart).replace(/\(.*/,"")
        var commaCount = line.substring(fnStart).match(/,/g)
        if (commaCount){
          call.param = commaCount.length
        }
      }
    }

    if (name.substring(0,2).toLowerCase() === "fn"){
      call = findFunctionDefinition(name, editor.getText(), call)
    } else {
      let functions = []
      functions = internalFunctions
      for (var i = 0; i < functions.length; i++) {
        if (functions[i].text.toLowerCase() === name.toLowerCase() && functions[i].params && functions[i].params.length > 0){
          call.name = functions[i].text
          call.params = functions[i].params
          break
        }
      }
    }

    return call
  }
}

function findFunctionByName(name, text, call){
  libraryPath = searchLibraryStatementsForFunction(name, text)
  if (libraryPath){
    let libraryText = getLibrarySource(libraryPath)
    call = findFunctionByNameInSource(name, getLibrarySource(libraryPath), call, true)
  } else {
    call = findFunctionByNameInSource(name, text, call)
  }
}

function searchLibraryStatementsForFunction(name, text){
  const reg = new RegExp(`\\blibrary\\s+(release\\s*,\\s*)?"(?<libpath>.*)"\\s*:\\s+.*${name}`, 'i')
  let match = reg.exec(text)
  return match ? "": match.groups.libpath
}

function findFunctionByNameInSource(name, text, call, searchLibraryFunctions = false){
  const reg = new RegExp(`\\bdef *${ searchLibraryFunctions ? "library *" }(?<name>${name.replace("$","\\$")})(?:\\*\\d+)?(?:\\(? *(?<paramString>[\\w$* &,;\\[\\]]*) *\\))`, 'i')
  let match = reg.exec(text)
  if (match !== null){
    call.name = match.groups.name
    call.params = parseParams(match.groups.paramString)
  }

  return call
}

function parseParams(paramString, includeLocals = false){
  const paramList = paramString.replace(/^;|&|mat | /gi,"").replace(/^;/,"").split(/;|,/)

  if (paramList.indexOf("___")>=0){
    if (includeLocals){
      paramList.splice(paramList.indexOf("___"),1)
    } else {
      paramList.splice(paramList.indexOf("___"))
    }
  }

  return paramList
}
