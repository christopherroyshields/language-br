
function after(p1, p2, strict = true) {
  return p1.row === p2.row && (strict ? p1.column > p2.column : p1.column >= p2.column) || p1.row > p2.row;
}

function lookup(editor, matches, cursor, step) {
  let
    i,
    len,
    match,
    ref,
    ref1,
    results

  if (!matches.length) {
    return;
  }

  ref1 = matches;
  ref = step;
  results = [];

  for ((ref > 0 ? (i = 0, len = ref1.length) : i = ref1.length - 1); ref > 0 ? i < len : i >= 0; i += ref) {
    match = ref1[i];
    match = match.range;
    if ((step === 1 && after(match.start, cursor)) || (step === -1 && after(cursor, match.end))) {
      editor.setCursorBufferPosition([match.start.row, match.start.column]);
      editor.addSelectionForBufferRange([[match.start.row, match.start.column], [match.end.row, match.end.column]]);
      if (atom.config.get('language-br.searchBling')) {
        matches[i].decorator.setProperties({type: 'text', class: 'occurence-current'})
      }
      break;
    }
  }
}

var lastSearch = "";

function init(editor) {
  let
    fromWord,
    matches = [],
    selection = editor.getSelectedText()

  selection = selection.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  if (selection.toLowerCase() !== lastSearch.toLowerCase()) {
    fromWord = false;
  } else {
    lastSearch = selection;
  }

  if (!selection) {
    editor.selectWordsContainingCursors();
    fromWord = true;
    selection = editor.getSelectedText();
    selection = selection.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    lastSearch = selection;
  }

  if (!selection) {
    return;
  }

  if (fromWord) {
    if (selection.slice(-1) === '$') {
      selection = '\\b' + selection
    } else {
      selection = '\\b' + selection + '(\\b|\\n)(?!\\$)';
    }
  }

  editor.scan(new RegExp(selection, 'gi'), (o) => {

    if (atom.config.get('language-br.searchBling')) {
      o.marker = editor.markBufferRange(o.range, {
        invalidate: 'never'
      })

      o.decorator = editor.decorateMarker(o.marker, {
        type: "text",
        class: "occurence"
      })

      setTimeout(function () {
        o.marker.destroy()
      }, 500);
    }

    matches.push(o);

  })

  return matches
}

module.exports = {
  next(editor) {
    let
      cursor,
      match,
      ref

    let matches = init(editor)

    if (!(match = (ref = matches.slice(-1)[0]) != null ? ref.range.start : void 0)) {
      return;
    }

    cursor = editor.getCursorBufferPosition();
    if (after(cursor, match, false)) {

      if (atom.config.get('language-br.searchBling')) {
         ref.decorator.setProperties({type: 'text', class: 'occurence-current-big'})
      }

      if (atom.config.get('language-br.searchSound')) {
         return atom.beep();
      }

    } else {
      return lookup(editor, matches, cursor, 1);
    }

  },
  prev(editor) {
    let
      cursor,
      match,
      ref

    let matches = init(editor)

    if (!(match = (ref = matches[0]) != null ? ref.range.end : void 0)) {
      return
    }

    cursor = editor.getCursorBufferPosition();

    if (after(match, cursor, false)) {
      // cursor = @editor.getEofBufferPosition()

      if (atom.config.get('language-br.searchBling')) {
        // this.animateSelection('occurence-current-big')
        ref.decorator.setProperties({type: 'text', class: 'occurence-current-big'})
      }
      if (atom.config.get('language-br.searchSound')) {
        return atom.beep();
      }
    } else {
      lookup(editor, matches, cursor, -1);
    }
  }
}
