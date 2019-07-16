const path = require("path")
const { exec } = require('child_process');
const { CompositeDisposable } = require('atom')


module.exports = {
  activate(state) {
    this.matches = [];
    this.lastSearch = "";
    this.fromWord = false;
    this.disposables = new CompositeDisposable();
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

    atom.commands.add('atom-workspace', {
      'language-br:compile': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        console.log(prog)
        console.log(path.basename(prog))
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`C:\\Lexi\\ConvStoO.cmd ${prog}`, {
            cwd: "C:\\Lexi"
          }, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
          });
        }
      }
    })
    atom.commands.add('atom-workspace', {
      'language-br:debug': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        console.log(prog)

        console.log(path.basename(prog))
        exec(`C:\\Lexi\\ConvStoO.cmd ${prog}`, {
          cwd: "C:\\Lexi"
        }, function (err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
        });
      }
    })
    atom.commands.add('atom-workspace', {
      'language-br:run': () => {
        var pane = atom.workspace.getActivePane()
        var prog = pane.activeItem.getPath()
        console.log(prog)
        console.log();
        console.log(path.basename(prog))
        if (path.extname(prog)===".brs" || path.extname(prog)===".wbs"){
          exec(`C:\\Lexi\\ConvStoO.cmd ${prog}`, {
            cwd: "C:\\Lexi"
          }, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            exec(`${bin} "RUN ${path.dirname(prog)}\\${path.basename(prog,".brs")}.br"`, {
              cwd: __dirname
            }, function (err, stdout, stderr) {
              console.log(stdout);
              console.log(stderr);
            });
          });
        }
      }
    })
  },
  deactivate() {
    return this.disposables.dispose()
  },
  init() {
    var selection;
    this.editor = atom.workspace.getActiveTextEditor();
    selection = this.editor.getSelectedText();

    if (selection.toLowerCase() !== this.lastSearch.toLowerCase() || !selection) {
      for (var i = 0; i < this.matches.length; i++) {
        this.matches[i].marker.destroy()
      }
      this.matches = [];
    }

    if (selection.toLowerCase() !== this.lastSearch.toLowerCase()) {
      this.fromWord = false;
    }
    if (!selection) {
      this.editor.selectWordsContainingCursors();
      this.fromWord = true;
      selection = this.editor.getSelectedText();
    }


    // var range = this.editor.getSelectedBufferRange()


    // if (this.selectedDecoration){
    //   this.selectedDecoration = this.editor.decorateMarker(marker, {
    //     type: "text",
    //     class: "occurence-current"
    //   })
    // }

    if (!selection) {
      return;
    }
    selection = selection.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    this.lastSearch = selection;
    if (this.fromWord) {
      selection = '\\b' + selection + '\\b';
    }
    return this.editor.scan(new RegExp(selection, 'gi'), (o) => {

      o.marker = this.editor.markBufferRange(o.range, {
        invalidate: 'never'
      })

      o.decorator = this.editor.decorateMarker(o.marker, {
        type: "text",
        class: "occurence"
      })

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
      return atom.beep();
    } else {
      return this.lookup(cursor, 1);
    }
  },
  prev() {
    var cursor, match, ref;
    if (!(match = (ref = this.matches[0]) != null ? ref.range.end : void 0)) {
      return;
    }
    cursor = this.editor.getCursorBufferPosition();
    if (this.after(match, cursor, false)) {
      // cursor = @editor.getEofBufferPosition()
      return atom.beep();
    } else {
      return this.lookup(cursor, -1);
    }
  },
  lookup(cursor, step) {
    var i, len, match, ref, ref1, results;
    var hitTheEnd=false;
    if (!this.matches.length) {
      return;
    }
    ref1 = this.matches;
    ref = step;
    results = [];
    hitTheEnd=false;
    for ((ref > 0 ? (i = 0, len = ref1.length) : i = ref1.length - 1); ref > 0 ? i < len : i >= 0; i += ref) {
      match = ref1[i];
      match = match.range;
      if ((step === 1 && this.after(match.start, cursor)) || (step === -1 && this.after(cursor, match.end))) {
        this.editor.setCursorBufferPosition([match.start.row, match.start.column]);
        this.editor.addSelectionForBufferRange([[match.start.row, match.start.column], [match.end.row, match.end.column]]);
        hitTheEnd=false;
        break;
      } else {
        //debugger;
        // Big Animation
         results.push(void 0);
         hitTheEnd=true;

      }
    }

    var range = this.editor.getSelectedBufferRange()
    if (this.marker){
      this.marker.setBufferRange(range)
    } else {
      this.marker = this.editor.markBufferRange(range)
    }
    if (hitTheEnd) {
      var decoration = this.editor.decorateMarker(this.marker, {type: 'text', class: 'occurence-current-big'})
    }else {
      var decoration = this.editor.decorateMarker(this.marker, {type: 'text', class: 'occurence-current'})
    }

    return results;
  }
}
