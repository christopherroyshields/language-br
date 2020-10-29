const numeric_functions = require('../completions/numeric_functions');
const string_functions = require('../completions/string_functions');
const { objectPath, sourcePath, isBrSource } = require('./util.js');
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
    atom.packages.getLoadedPackage("autocomplete-plus").mainModule.autocompleteManager.suggestionList.suggestionListElement.element.insertAdjacentElement("afterbegin", this.autoCompleteHintEl)

    this.decoration = null
    this.disposables = new CompositeDisposable()
    this.subscriptions = new CompositeDisposable()

    atom.workspace.observeTextEditors((editor)=>{
      if (editor){
        this.disposables.add(this.watchEditor(editor))
      }
    })

    // atom.workspace.onDidChangeActiveTextEditor(editor => {
    //   if (editor) console.log("no editor");
    //   console.log(editor)
    // })

    // observe text observeTextEditors

      // on focus

        // start watching events

          // on text changed
            // cursor moved


      // on blur
        // stop watching events


  }
  watchEditor(editor){
    const cursor = editor.getLastCursor()
    if (cursor == null) { return }

    let view = atom.views.getView(editor)
    if (view.hasFocus()) {
      const bufferPosition = cursor.getBufferPosition()
      this.showFunctionHint(editor, bufferPosition)
    }

    // let shouldActivate = false
    // editor.getBuffer().onDidChangeText(({changes})=>{
    //   this.showFunctionHint(editor, bufferPosition)
    // })

    // editor.onDidChange((editor)=>{
    //   // if in functon call and
    //   const cursor = editor.getLastCursor()
    //   if (cursor == null) { return }
    //   const bufferPosition = cursor.getBufferPosition()
    //
    //   console.log(arguments);
    //   console.log("changed");
    //
    //   this.showFunctionHint(editor, e.newBufferPosition)
    // })

    // let focusListener = (element) => {
    //   let cursor = editor.getLastCursor()
    //   if (cursor == null) { return }
    //   let bufferPosition = cursor.getBufferPosition()
    //   this.showFunctionHint(editor, bufferPosition)
    // }

    // view.addEventListener('focus', focusListener)
    //

    let blurListener = (element) => this.hide()
    view.addEventListener('blur', blurListener)

    // const cursor = editor.getLastCursor()
    // if (cursor == null) { return }

    let disposables = new CompositeDisposable();

    disposables.add(cursor.onDidChangePosition((e)=>{
      this.showFunctionHint(editor, e.newBufferPosition)
    }))

    disposables.add(
      cursor.onDidDestroy((e)=>{
        this.hide()
      })
    )

    return disposables

    // return new Disposable(() => {
    //   view.removeEventListener('focus', focusListener)
    //   view.removeEventListener('blur', blurListener)
    // })
  }

  showFunctionHint(editor, bufferPosition){

    this.hide()

    const call = this.getFnCall(editor, bufferPosition)

    this.hintEl.name = call.name
    this.hintEl.params = ["Test1", "test2", "test3", "test4", "test5"]
    this.hintEl.param = call.param

    this.autoCompleteHintEl.name = call.name
    this.autoCompleteHintEl.params = ["Test1", "test2", "test3", "test4", "test5"]
    this.autoCompleteHintEl.param = call.param

    if (call.name){
      this.decoration = editor.decorateMarker(editor.getLastCursor().getMarker(), {
        type: "overlay",
        class: "detached-function-hint",
        item: this.hintEl
      })
    }
  }

  hide(){
    if (this.decoration){
      this.decoration.destroy()
      this.decoration = null
    }
  }

  stripBalancedFunctions(line){
    if (CONTAINS_BALANCED_FN.test(line)){
      line = line.replace(CONTAINS_BALANCED_FN, "")
      line = this.stripBalancedFunctions(line)
    }
    return line
  }
  getFnCall(editor, bufferPosition){
    var call = {
      name : "",
      param : 0
    }

    var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])

    // strip functions with params
    if (line){
      line = this.stripBalancedFunctions(line)
      var fnStart = line.search(/[a-zA-Z][a-zA-Z0-9_]*?\$?(?:\()[^(]*$/)
      if (fnStart >=0 ){
        call.name = line.substring(fnStart).replace(/\(.*/,"")
        var commaCount = line.substring(fnStart).match(/,/g)
        if (commaCount){
          call.param = commaCount.length
        }
      }
    }

    return call
  }
}
