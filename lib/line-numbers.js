const ONGOTO_LINE_REFERENCE = /(goto|gosub)[ \t]+\w+[ \t]*([ \t]*,[ \t]*\w+[ \t]*)+/gi
const INT_SEARCH = /\b\d+\b/g
const ERROR_LINE_REFERENCE = /(?<=attn|duprec|conv|eof|error|exit|help|ioerr|locked|nokey|norec|oflow|pageoflow|soflow|using|zdiv|none|goto|gosub)([\s\t]+)(\d+)/gi
const LINE_LABEL = /^\s*\d+\s+(?<label>\w\w*):/
const LINE_NUMBER = /^[ \t]*\d+ ?/gm
const LPAD_TRIM = /([\s\t]*)(\d+)/
const STRING_EMPTY = ""
const COMMENT_STRING = /("([^"]|"")*"|'([^']|'')*'|![^:\n]*(!:|\n))/g
const HAS_LINE_NUMBERS = /^[ \t]*\d+[ \t]/

module.exports = {
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

      textBuffer.setText(bufferText);

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
