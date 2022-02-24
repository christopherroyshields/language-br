const BRSOURCE_EXTENSION = /(br|wb)s$/i
const CompileStatusIcon = document.createElement("span")
const fs = require('fs');
CompileStatusIcon.classList.add("icon", "icon-repo-sync", "compileStatusIcon")

function compiledPath(sourcePath){
  return sourcePath.replace(/(br|wb)s$/i,"$1")
}

module.exports = {

  compileStatusIcon: CompileStatusIcon,

  decompile(prog, editor){
    let
      lexiCloud = atom.config.get('language-br.cloudLexi'),
      protocol = atom.config.get('language-br.cloudLexiHttps') ? "https": "http",
      myHeaders = new Headers()

    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "bin": fs.readFileSync(prog, 'base64')
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${protocol}://${lexiCloud}/decompile`, requestOptions)
      .then(response => response.text())
      .then(result => {
        var resultObj = JSON.parse(result)
        editor.setText(resultObj.lines.join(os.EOL))
        editor.setGrammar(atom.grammars.grammarForScopeName('.source.br'))
      })
      .catch(error => {
        console.error('error', error)
        atom.notifications.addError(`Failed to decompile ${prog}`);
      });
  },

  compile(editor, sourcePath){
    CompileStatusIcon.classList.add("rotating")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "lines": editor.getBuffer().getLines()
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    var lexiUrl = atom.config.get('language-br.cloudLexi');
    var protocol = atom.config.get('language-br.cloudLexiHttps') ? "https": "http";

    if (editor.errmarker){
        editor.errmarker.destroy()
    }

    let status
    fetch(`${protocol}://${lexiUrl}/compile`, requestOptions)
      .then(response => {
        status = response.status
        return response.text()
      })
      .then(result => {
        if (status !== 200)
          throw new Error(result)

        let {
          error,
          bin,
          line,
          message,
          sourceLine,
          sourceLineEnd,
        } = JSON.parse(result)

        CompileStatusIcon.classList.remove("rotating")

        if (bin && !error){
          var binPath = sourcePath.replace(BRSOURCE_EXTENSION,"$1")
          fs.writeFile(binPath, Buffer.from(bin, 'base64'), ()=>{
            atom.notifications.addInfo(`Compiled ${binPath} Successfully!`, {
              dismissable: true
            });
          })
          setTimeout(a=>{
            atom.notifications.getNotifications().forEach( n => n.dismiss() );
          }, 1000);
        }

        if (error && !bin){
          atom.notifications.addError(`Error ${error}<a href="http://brwiki2.brulescorp.com/index.php?title=${error}">&#128279;</a> on line ${sourceLine}.`, {
            dismissable: true,
            detail: message
          })
          if (sourceLine){
            editor.setCursorBufferPosition([sourceLineEnd-1,0])
            editor.moveToEndOfLine()
            var startLineText = editor.lineTextForBufferRow(sourceLine-1)
            var lastLineText = editor.lineTextForBufferRow(sourceLineEnd-1)

            editor.errmarker = editor.markBufferRange([
              [
                sourceLine-1,
                0
              ],
              [
                sourceLineEnd-1,
                lastLineText.length
              ]
            ])

            editor.decorateMarker(editor.errmarker, {
              class: 'error-marker',
              type: 'highlight'
            });
          }
          setTimeout(a=>{
            atom.notifications.getNotifications().forEach( n => n.dismiss() );
          }, 10000);
        }

        if (error && bin){
          atom.notifications.addWarning(`Error ${error}<a href="http://brwiki2.brulescorp.com/index.php?title=${error}">&#128279;</a> on line ${sourceLine}.`, {
            dismissable: true,
            detail: message
          })
          setTimeout(a=>{
            atom.notifications.getNotifications().forEach( n => n.dismiss() );
          }, 4000);
        }


      })
      .catch(error => {
        let message;

        try {
          let errorResponse = JSON.parse(error.message)
          message = `Server Error: ${status.toString()}\n${errorResponse.message}`
        } catch(err) {
          message =  `URL: at ${protocol}://${lexiUrl}/compile\n${error.message}`
        }

        console.error(message)

        atom.notifications.addError(`Error Connecting to Lexicloud`, {
          detail: message
        })

        CompileStatusIcon.classList.remove("rotating")
      });
  }
}
