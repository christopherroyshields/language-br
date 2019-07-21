const {CompositeDisposable, TextEditor} = require('atom')

class DebugConsole {
  constructor({command,output}){
    // super()
    this.command = command
    this.output = output
  }
}

class DebugConsoleView extends HTMLElement {
  constructor({output, command}) {
    super()

    this.classList.add("br-debug-console")

    var testEditor = new TextEditor({
      mini: true
    })

    var editorCont = document.createElement("editor-container")
    editorCont.classList.add("br-command-editor")

    editorCont.appendChild(testEditor.element)

    var execBtn = document.createElement("button")
    execBtn.classList.add("btn")
    execBtn.innerHTML = "Run..."

    editorCont.appendChild(testEditor.element)
    editorCont.appendChild(execBtn)

    this.output = output
    this.command = command
    // this.shadow = this.attachShadow({mode: 'open'});
    this.appendChild(this.template.content.cloneNode(true));
    this.appendChild(editorCont);

  }

  get template(){
    // debugger
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <pre class="output">${this.output}</pre>
    `
    return tmpl
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  // getElement() {
  //   return this.element;
  // }
}

customElements.define('debug-console-view', DebugConsoleView);


module.exports = {
  DebugConsole,
  DebugConsoleView
}
