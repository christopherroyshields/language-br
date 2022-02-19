const ONGOTO_LINE_REFERENCE = /(goto|gosub)[ \t]+\w+[ \t]*([ \t]*,[ \t]*\w+[ \t]*)+/gi
const INT_SEARCH = /\b\d+\b/g
const ERROR_LINE_REFERENCE = /(?<=attn|duprec|conv|eof|error|exit|help|ioerr|locked|nokey|norec|oflow|pageoflow|soflow|using|zdiv|none|goto|gosub)([\s\t]+)(\d+)/gi
const LINE_LABEL = /^\s*\d+\s+(?<label>\w\w*):/
const LINE_NUMBER = /^[ \t]*\d+ ?/gm
const LPAD_TRIM = /([\s\t]*)(\d+)/
const STRING_EMPTY = ""

module.exports = {
  removeLineNumbers(editor, prog, source) {
    try {
      let textBuffer = editor.getBuffer()
      let bufferText = textBuffer.getText()

      let newLabelList = {};

      bufferText = bufferText.replace(ONGOTO_LINE_REFERENCE, (lineMatch, p1, p2, index, source) => {
        return lineMatch.replace(INT_SEARCH, (intMatch) => {
          let lineNumber = parseInt(intMatch)
          return this.createLabel(lineNumber, source, newLabelList)
        })
      })

      bufferText = bufferText.replace(ERROR_LINE_REFERENCE, (lineMatch, p1, p2, index, source) => {
        return lineMatch.replace(INT_SEARCH, (intMatch) => {
          let lineNumber = parseInt(intMatch)
          return this.createLabel(lineNumber, source, newLabelList)
        })
      })

      Object.keys(newLabelList).forEach((item, i) => {
        let lineReplace = new RegExp(`^[ \\t]*0*${item}[ \\t]`, 'm')
        bufferText = bufferText.replace(lineReplace, `$&L${item}: `)
      });

      bufferText = bufferText.replace(LINE_NUMBER, "")

      textBuffer.setText(bufferText);

    } catch(err){
      throw err
    }

  },

  // creates label is none exists
  createLabel(lineNumber, source, newLabelList){
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
}
