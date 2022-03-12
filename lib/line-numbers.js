const os = require('os');

const ONGOTO_LINE_REFERENCE = /(goto|gosub)[ \t]+\w+[ \t]*([ \t]*,[ \t]*\w+[ \t]*)+/gi
const INT_SEARCH = /\b\d+\b/g
const ERROR_LINE_REFERENCE = /(?<=attn|duprec|conv|eof|error|exit|help|ioerr|locked|nokey|norec|oflow|pageoflow|soflow|using|zdiv|none|goto|gosub)([\s\t]+)(\d+)/gi
const LINE_LABEL = /^\s*\d+\s+(?<label>\w\w*):/
const LINE_NUMBER = /^[ \t]*\d+ ?/gm
const LPAD_TRIM = /([\s\t]*)(\d+)/
const STRING_EMPTY = ""
const COMMENT_STRING = /(\/\*(\r|\n|.)*\*\/|`([^`]|``)*?{{|}}([^`]|``)*?{{|}}([^`]|``)*`|`([^`]|``)*`|"([^"]|"")*"|'([^']|'')*'|![^_:\n]*(?=!:|\n)|(?<=\n|^)[ \t]*rem[^\n]*)/gi
const HAS_LINE_NUMBERS = /^[ \t]*\d+[ \t]/

// const LINES_NEEDING_NUMBERS = /(\r?\n)(([^!\n]*(=|\+|-|\+=|-=|\*|\/|,|&|\(| and| or|,|!_|!:)[ \t]*(!.*)*\r?\n)+.*|.*)/gi

const HAS_AUTONUMBER_IN_COMMENT = /(!|^[ \t]*rem).*#autonumber#[ \t]*(?<lineCount>\d+),[ \t]*(?<increment>\d+)/gi
const NOT_IN_STRING = /(\/\*(\r|\n|.)*\*\/|`([^`]|``)*?{{|}}([^`]|``)*?{{|}}([^`]|``)*`|`([^`]|``)*`|"([^"\n]|"")*"|'([^\n']|'')*'|$)/gi

// const NEW_LINES_CONT = /(=|\+|-|\+=|-=|\*|\/|,|&|\(| and| or|,|!_|!:)?([ \t]*\n)/gi

const LINE_IS_CONTINUATED = /(=|\+|-|\+=|-=|\*|\/|,|&|\(|[ \t]*and|[ \t]*or|,|!_|!:)[ \t]*(!|$)/i

const CODE_SPLIT = /(?<code>^([^!]*!:[ \t]*|[^!]*!_[ \t]*|[^!]*)*)(?<comment>(![^_].*|!$))?/

var
  lineCount,
  increment,
  lineNumberNotification,
  autoNumberError = null

function handleLabels(newLine, lineCount){
  const HAS_L_LABEL = /^[ \t]*L(?<labelNumber>\d*):/i
  HAS_L_LABEL.lastIndex = 0
  let labelMatch = HAS_L_LABEL.exec(newLine)
  if (labelMatch && labelMatch.groups.labelNumber){
    let lnum = parseInt(labelMatch.groups.labelNumber)
    if (lnum >= lineCount.count){
      lineCount.count = lnum
    } else {
      lineCount.increment = Math.max(parseInt(lineCount.increment / 2),2)
    }
  }
}

function handleAutoNumber(newLine, lineCount){
  HAS_AUTONUMBER_IN_COMMENT.lastIndex = 0
  let autoNumberMatch
  while ((autoNumberMatch = HAS_AUTONUMBER_IN_COMMENT.exec(newLine)) !== null){
    let newLineCount = parseInt(autoNumberMatch.groups.lineCount)
    let newIncrement = parseInt(autoNumberMatch.groups.increment)
    if (newLineCount >= lineCount.count){
      lineCount.count = newLineCount
      if (newIncrement){
        lineCount.increment = newIncrement
      }
    } else {
      if (!autoNumberError){
        autoNumberError = {
          lineCount,
          newLineCount
        }
      }
    }
  }
}

function getLines(bufferText) {

    let
      match,
      lineStack = "",
      commentStack = "",
      newLines = [],
      chunkStart = 0,
      lineCount = {
        count: 1,
        increment: 1,
        sourceLine: 0
      }

    NOT_IN_STRING.lastIndex = 0

    while ((match = NOT_IN_STRING.exec(bufferText)) !== null) {


      let chunk = bufferText.substring(chunkStart, match.index)

      let
        code = [],
        comment = []

      // split lined into code and comment
      let lines = chunk.split(/\r?\n/g)
      for (var i = 0; i < lines.length; i++) {
        let lineMatch = CODE_SPLIT.exec(lines[i])
        code[i] = lineMatch.groups.code ?? ""
        comment[i] = lineMatch.groups.comment ? lineMatch.groups.comment.substring(1) : "";
      }

      lineStack += code[0]
      commentStack += comment[0]

      for (var i = 1; i < lines.length; i++) {
        if (LINE_IS_CONTINUATED.test(code[i-1])){
          lineStack += os.EOL + "      " + code[i]
          commentStack += comment[i]
        } else {

          let newLine = lineStack + (commentStack.length ? "!" + commentStack : "")
          handleAutoNumber(newLine, lineCount)
          handleLabels(newLine, lineCount)

          // add comment to blank lines
          if (newLine.trim() == ""){
            newLine = "!" + newLine
          }

          newLines.push([lineCount.count, newLine])
          lineCount.count += lineCount.increment
          lineCount.sourceLine += 1

          lineStack = code[i]
          commentStack = comment[i]
        }
      }

      // append string literal
      lineStack += match[0]

      chunkStart = NOT_IN_STRING.lastIndex

      // stop at end - will loop infinitely if not stopped
      if (NOT_IN_STRING.lastIndex === bufferText.length){
        // if line still in buffer at end
        if (lineStack.length){
          let newLine = lineStack + (commentStack.length ? "!" + commentStack : "")
          handleAutoNumber(newLine, lineCount)
          handleLabels(newLine, lineCount)
          newLines.push([lineCount.count, newLine])
        }
        NOT_IN_STRING.lastIndex
        break
      }
    }

    // handle error autonumber error
    if (autoNumberError){
      if (lineNumberNotification){
        if (lineNumberNotification.options.description
          !== `Autonumber error in ${autoNumberError.lineCount.count} to ${autoNumberError.newLineCount} autonumber section.`
          || lineNumberNotification.dismissed){

          lineNumberNotification.dismiss()
          lineNumberNotification = atom.notifications.addError(`Autonumber Error`, {
            dismissable: true,
            description: `Autonumber error in ${autoNumberError.lineCount.count} to ${autoNumberError.newLineCount} autonumber section.`
          })
        }
      } else {
        lineNumberNotification = atom.notifications.addError(`Autonumber Error`, {
          dismissable: true,
          description: `Autonumber error in ${autoNumberError.lineCount.count} to ${autoNumberError.newLineCount} autonumber section.`
        })
      }
    } else {
      if (lineNumberNotification)
        lineNumberNotification.dismiss()
    }

    return newLines
}

module.exports = {
  addLineNumbers(editor) {
    try {
      let textBuffer = editor.getBuffer()
      let bufferText = textBuffer.getText()

      if (HAS_LINE_NUMBERS.test(bufferText)) throw new Error("Source already has line numbers.")

      let newLines = getLines(bufferText)

      let newBufferText = ""
      for (var i = 0; i < newLines.length; i++) {
        newBufferText += newLines[i][0].toString().padStart(5,"0") + " " + newLines[i][1] + os.EOL
      }

      textBuffer.setText(newBufferText);

    } catch (err){
      throw err
    }
  },
  removeLineNumbers(editor) {
    try {
      let textBuffer = editor.getBuffer()
      let bufferText = textBuffer.getText()

      if (!HAS_LINE_NUMBERS.test(bufferText)) throw new Error("Source does not have line numbers.")

      let newLabelList = {};

      let match,
          chunkStart = 0

      // get areas not commented or strings
      while ((match = COMMENT_STRING.exec(bufferText)) !== null) {

        let chunk = bufferText.substring(chunkStart, match.index)
        let newChunk = processChunk(chunk, bufferText, newLabelList)

        bufferText = replaceBetween(bufferText, chunkStart, match.index, newChunk)

        // adjust for length diference
        COMMENT_STRING.lastIndex += newChunk.length - chunk.length

        chunkStart = COMMENT_STRING.lastIndex
      }

      // dont forget last chunk
      let chunk = bufferText.substring(chunkStart, bufferText.length)
      let newChunk = processChunk(chunk, bufferText, newLabelList)
      bufferText = replaceBetween(bufferText, chunkStart, bufferText.length, newChunk)

      Object.keys(newLabelList).forEach((item, i) => {
        let lineReplace = new RegExp(`^[ \\t]*0*${item}[ \\t]`, 'm')
        bufferText = bufferText.replace(lineReplace, `$&L${item}: `)
      });

      let lastLineNumberWidth = 0;

      bufferText = bufferText.replace(/^[ \t]*(?<linenumber>\d+ ?)?(?=.)/gm, (match, p1, offset, source, groups) => {
        if (groups.linenumber){
          lastLineNumberWidth = groups.linenumber.length
          return ""
        } else {
          let whiteSpaceWidth = Math.min(lastLineNumberWidth, match.length)
          return match.substring(whiteSpaceWidth)
        }
      })

      let cursorPosition = editor.getCursorBufferPosition()
      let oldLine = editor.lineTextForBufferRow(cursorPosition.row)
      let newLine = bufferText.split(/\r?\n/)[cursorPosition.row]
      cursorPosition.column = cursorPosition.column - (oldLine.length - newLine.length)

      textBuffer.setText(bufferText);

      editor.setCursorBufferPosition(cursorPosition)

    } catch(err){
      console.error(err)
      throw err
    }

  }
}

function replaceBetween(origin, startIndex, endIndex, insertion) {
  return origin.substring(0, startIndex) + insertion + origin.substring(endIndex);
}

function processChunk(chunk, bufferText, newLabelList){
  chunk = chunk.replace(ONGOTO_LINE_REFERENCE, (lineMatch, p1, p2, index, source) => {
    return lineMatch.replace(INT_SEARCH, (intMatch) => {
      let lineNumber = parseInt(intMatch)
      return createLabel(lineNumber, bufferText, newLabelList)
    })
  })

  chunk = chunk.replace(ERROR_LINE_REFERENCE, (lineMatch, p1, p2, index, source) => {
    return lineMatch.replace(INT_SEARCH, (intMatch) => {
      let lineNumber = parseInt(intMatch)
      return createLabel(lineNumber, bufferText, newLabelList)
    })
  })

  return chunk
}

function createLabel(lineNumber, source, newLabelList){
  let lineString = lineNumber.toString()
  let label = null

  const existingLabelSearch = new RegExp(
    `^[ \\t]*0*${lineString}[ \\t]+(?<label>[a-z_]\\w*):`,
    'im'
  )

  let labelMatch = source.match(existingLabelSearch);
  if (labelMatch == null){
    newLabelList[lineString] = lineNumber
    label = `L${lineString}`
  } else {
    label = labelMatch.groups.label
  }

  return label
}
