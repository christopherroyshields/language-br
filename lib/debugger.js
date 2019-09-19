const
  net = require('net'),
  EventEmitter = require('events'),
  { exec } = require('child_process'),
  path = require('path'),
  { objectPath } = require('./util.js'),
  {default: PQueue} = require('p-queue')

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

class BrDebugClient extends EventEmitter {
  constructor(socket){
    super()
    this.queue = new PQueue({concurrency: 1})
    this.socket = socket
    this.ready = false

    this.socket.on('error', (err)=>{
      console.log("Error:" + err)
    })

    this.on('ready', ()=>{
      this.cmd([
        `st config >DEBUG:`
        // `load ":${objectPath(sourcePath)}"`
      ], socket)
        .then((result)=>{
          console.log("result1",result)
          // return this.cmd(`load ":${objectPath(sourcePath)}"`, socket)
        })
    })

    this.socket.on('data', (buf) => {
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
            error = packet.readInt32BE(12)

            console.log("status", STATUS[status])
            console.log("error", error)

            if (this.ready){
              this.emit("done", error, STATUS[status])
            } else {
              this.ready = true
              this.emit("ready")
            }

            break;

          case COMMAND_RESPONSE:
            let result_code = packet.readInt32BE(8)
            if (result_code===0){
              console.log("Command success");
            } else {
              console.log("Command failed", result_code);
            }
            console.log(PACKET_TYPE[COMMAND_RESPONSE])
            break;

          case DEBUG_DATA:
            let
              channel = packet.readInt32BE(8),
              text = packet.toString('utf8', 12, length)

            this.commandOutput += text

            // console.log("Channel", channel);
            // console.log("Debug Data", text);

            break;
          default:
            console.log("uncaught command")
        }
      }
    })
  }

  async cmd(commands, socket, cb){
    if (typeof commands==="string"){
      commands = [commands]
    }
    let
      result,
      results = [],
      command
    for (var i = 0; i < commands.length; i++) {
      command = commands[i]
      result = await this.queue.add(()=>new Promise((resolve)=>{
        let
          outputLength = Buffer.byteLength(command)+8,
          commandBuffer = Buffer.alloc(outputLength)

        commandBuffer.writeInt32BE(outputLength,0)
        commandBuffer.writeInt32BE(ISSUE_COMMAND,4)
        commandBuffer.write(command,8)
        this.commandOutput = ""

        this.once("done", (err, status)=>{
          resolve({ err, status, result: this.commandOutput})
        })

        this.socket.write(commandBuffer)
      }))
      results.push(result)
    }
    return results
  }
}

class BrDebugServer extends EventEmitter {
  constructor(){
    super()
    this.queue = new PQueue({concurrency: 1})
    this.clients = []
    this.server = net.createServer((socket) => {
      var client = new BrDebugClient(socket)
      this.clients.push(client)
      console.log("Client Connected")
      // let
      //   ready = false

        // this.cmd([
        //   `st st >DEBUG:`,
        //   `st all >DEBUG:`
        //   // `load ":${objectPath(sourcePath)}"`
        // ], socket)
        //   .then((result)=>{
        //     console.log("result2",result)
        //     // return this.cmd(`load ":${objectPath(sourcePath)}"`, socket)
        //   })
    }).listen()
  }
}

module.exports = { BrDebugServer, BrDebugClient }
