const path = require("path")
const { exec } = require('child_process');
module.exports = {
  activate(state) {
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
  }
}
