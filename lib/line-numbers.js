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
      var textBuffer = editor.getBuffer()
      var checkpoint = textBuffer.createCheckpoint()

      let newLabelReplacements = new Map();

      textBuffer.scan(ONGOTO_LINE_REFERENCE, (match) => {
        let lineRef = []
        let matchText = match.matchText
        while ((lineRef = INT_SEARCH.exec(match.matchText)) !== null){
          var lineNumber = parseInt(lineRef[0])
          let newLabelReplacement = this.createLabel(textBuffer, lineNumber)
          if (newLabelReplacement != null){
            newLabelReplacements.set(lineNumber, newLabelReplacement)
          }
        }
      })

      textBuffer.scan(ERROR_LINE_REFERENCE, (match) => {
        let lineNumber = parseInt(match.matchText)
        if (!newLabelReplacements.has(lineNumber)){
          let newLabelReplacement = this.createLabel(textBuffer, lineNumber)
          if (newLabelReplacement != null){
            newLabelReplacements.set(lineNumber, newLabelReplacement)
          }
        }
      })

      newLabelReplacements.forEach(r => r());

      textBuffer.scan(ONGOTO_LINE_REFERENCE, (match) => {
        var numberSearch = /\b\d+\b/g
        let lineRef = []
        let matchText = match.matchText
        while ((lineRef = numberSearch.exec(match.matchText)) !== null){
          var lineNumber = parseInt(lineRef[0])
          let label = this.findLabel(textBuffer, lineNumber)
          if (label != null) {
            let replaceReg = new RegExp(`\\b${lineRef[0]}\\b`)
            matchText = matchText.replace(replaceReg, label)
          }
        }
        match.replace(matchText)
      })

      textBuffer.scan(ERROR_LINE_REFERENCE, (match) => {
        let lineNumber = parseInt(match.matchText)
        let label = this.findLabel(textBuffer, lineNumber)
        if (label !== null) {
          var matchGroups = LPAD_TRIM.exec(match.matchText)
          match.replace(matchGroups[1] + label)
        }
      })

      textBuffer.scan(LINE_NUMBER, (match) => {
        match.replace(STRING_EMPTY)
      })

      textBuffer.groupChangesSinceCheckpoint(checkpoint)
    } catch(err){
      textBuffer.revertToCheckpoint(checkpoint)
      throw err
    }

  },

  findLabel(textBuffer, lineNumber){
    let lineString = lineNumber.toString()
    let label = null

    const lineSearch = new RegExp(`(?<=^|\\n)[ \\t]*0*${lineString}[ \\t](?=\\w)`)

    textBuffer.scan(lineSearch, (match) => {
      let lineFound = match.lineText
      label = this.getLineLabel(lineFound)
    })

    return label
  },

  // creates label is none exists
  createLabel(textBuffer, lineNumber){
    let lineString = lineNumber.toString()
    let label = null

    const lineSearch = new RegExp(`^[ \t]*0*${lineString}([ \t]|(?=!))`,'m')

    let lineFound = false

    let replace

    textBuffer.scan(lineSearch, (match) => {
      lineFound = true
      label = this.getLineLabel(match.lineText)
      if (label == null){
        label = `L${lineString}`
        replace = () => {
          match.replace(match.matchText + label + ': ')
        }
      }
    })

    if (!lineFound){
      throw new Error(`Line reference not found: ${lineString}`)
    }

    return replace
  },

  getLineLabel(line) {
    let result = null
    let match = LINE_LABEL.exec(line)
    if (match != null){
      result = match[1]
    }
    return result
  }
}
