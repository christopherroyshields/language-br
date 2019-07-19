const EventEmitter = require('events');

class ConsoleView extends EventEmitter {
  constructor(serializedState) {
    super()

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('br-console');


    // Create message element
    const output = document.createElement('pre');
    output.textContent = 'The BR Console is Alive! It\'s ALIVE!';
    output.classList.add('output');
    this.element.appendChild(output);

    const input = document.createElement('input');
    input.value = 'command';
    this.element.appendChild(input);



  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  show() {
    console.log("overloaded show")
    super.show()
  }

  getElement() {
    return this.element;
  }
}

module.exports = ConsoleView
