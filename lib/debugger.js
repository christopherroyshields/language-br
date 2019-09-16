const
  net = require('net'),
  EventEmitter = require('events'),
  { exec } = require('child_process'),
  path = require('path'),
  { objectPath } = require('./util.js')

const STATUS = [
  "INVALID", // 0 (displayed as READY)
  "RUN", // R
  "ATTN", // A
  "ERROR", // E
  "PAUSE", // P
  "CHAIN", // C
  "LIST", // L
  "STEP", // S
  "SYSERR", // s
  "LOAD", // l
  "SAVE", // v
  "REPLACE", // r
  "PROC", // p
  "EXEC", // X
  "READY" // e
];

const
  FORCE_BREAK = 1,
  ISSUE_COMMAND = 2,
  FORCE_BREAK_RESPONSE = 101,
  INPUT_MODE = 102,
  COMMAND_RESPONSE = 103,
  DEBUG_DATA = 104,
  DEBUG_VARIABLE_BREAK = 105,
  DEBUG_FUNCTION_BREAK = 106,
  DEBUG_LINE_BREAK = 107,
  DEBUG_BEGIN_BREAK = 108,
  SYNTAX_ERROR_INDENT = 109,
  DEBUG_MESSAGE_LOG = 110

const PACKET_TYPE = []
PACKET_TYPE[FORCE_BREAK]="FORCE BREAK"
PACKET_TYPE[ISSUE_COMMAND]="ISSUE COMMAND"
PACKET_TYPE[FORCE_BREAK_RESPONSE]="FORCE BREAK RESPONSE"
PACKET_TYPE[INPUT_MODE]="ENTER INPUT MODE"
PACKET_TYPE[COMMAND_RESPONSE]="ISSUE COMMAND"
PACKET_TYPE[DEBUG_DATA]="ISSUE COMMAND"
PACKET_TYPE[DEBUG_VARIABLE_BREAK]="ISSUE COMMAND"
PACKET_TYPE[DEBUG_FUNCTION_BREAK]="ISSUE COMMAND"
PACKET_TYPE[DEBUG_LINE_BREAK]="ISSUE COMMAND"
PACKET_TYPE[DEBUG_BEGIN_BREAK]="ISSUE COMMAND"
PACKET_TYPE[SYNTAX_ERROR_INDENT]="ISSUE COMMAND"
PACKET_TYPE[DEBUG_MESSAGE_LOG]="ISSUE COMMAND"

const BREAK = Buffer.alloc(4).writeInt32BE(1)
const COMMAND = Buffer.alloc(4).writeInt32BE(2)

class BrDebugger extends EventEmitter {
  constructor(sourcePath, projectPath){
    super()
    this.server = net.createServer((socket) => {
      console.log("Connected")
      let
        ready = false

      this.on('ready', ()=>{
        this.cmd(`load ":${objectPath(sourcePath)}"`, socket, (err,status,output)=>{
          this.cmd(`run`, socket, (err,status,output)=>{
            console.log("loaded");
          })
        })
      })

      socket.on('error',(err)=>{
        console.log("Error:" + err)
      })

      socket.on("data", (buf) => {
        let offset = 0
        while (offset < buf.length) {
          let
            status=0,
            error=0,
            length = buf.readInt32BE(offset),
            packet = buf.slice(offset, offset + length),
            type = packet.readInt32BE(4)

          offset += length

          console.log("data received")
          console.log("length in bytes", length);
          console.log("total buffer length", buf.length);
          console.log("type", PACKET_TYPE[type]);
          switch (type) {
            case INPUT_MODE:
              status = packet.readInt32BE(8)

              console.log("status", STATUS[status])
              console.log("error", error)

              if (ready){
                this.emit("done", error, STATUS[status])
              } else {
                ready=true
                this.emit("ready")
              }

              break;

            case COMMAND_RESPONSE:
              let result_code = buf.readInt32BE(8)
              if (result_code===0){
                console.log("Command success");
              } else {
                console.log("Command failed", result_code);
              }
              console.log(PACKET_TYPE[COMMAND_RESPONSE])
              break;

            case DEBUG_DATA:
              let
                channel = buf.readInt32BE(8),
                text = buf.toString('utf8', 12, length)

              this.commandOutput += text

              console.log("Channel", channel);
              console.log("Debug Data", text);

              break;
            default:
              console.log("uncaught command")
          }
        }
      })
    }).listen(()=>{
      this.lexiPath = path.normalize(__dirname+"\\..\\Lexi")
      exec(`${this.lexiPath}\\brnative.exe "debug connect 127.0.0.1:${this.server.address().port}"`, {
        cwd: `${projectPath}`
      })
    })

    // this.on("ready", ()=>{
    //   console.log("ready");
    //   this.cmd("load fileio", (err, status)=>{
    //     console.log("loaded");
    //     this.cmd("run", ()=>{
    //
    //     })
    //   })
    // })
  }

  break(){
    // use this for sending cntrl a
  }

  cmd(command, socket, cb){
    let
      outputLength = Buffer.byteLength(command)+8,
      commandBuffer = Buffer.alloc(outputLength)

    commandBuffer.writeInt32BE(outputLength,0)
    commandBuffer.writeInt32BE(ISSUE_COMMAND,4)
    commandBuffer.write(command,8)
    this.commandOutput = ""

    this.once("done", (err, status)=>{
      cb(err, status, this.commandOutput)
    })

    socket.write(commandBuffer)
  }

  startProg(program){
    // spawn program here


    // listen for relevant events


  }
}

module.exports = BrDebugger
