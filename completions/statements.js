module.exports = [
  {
    "text": "Def",
    "displayText": "Def Fn ... fnend",
    "snippet": "def fn${1:name}(${2:params})\n  $3\nfnend",
    "description": "Define Function",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?title=Def",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Chain",
    "displayText": "Chain {<program name>|\"PROC=<name>\"|\"SUPROC=<name>\"} ...",
    "snippet": "Chain ${1:Program$}$0",
    "description": "Loads and Runs the target program, immediately ending the current program. Optionally passes variables and files into the called program.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Chain",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Close",
    "displayText": "Close {#<file/window number>} [,Free|Drop] [, ...] :",
    "snippet": "Close ${1:FileNumber}:$0",
    "description": "Closes the current program.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Close",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Continue",
    "displayText": "Continue",
    "snippet": "Continue\n$0",
    "description": "Jumps to the line following the line that had the most recent error. Used to continue in an Error Handler.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Continue",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Data",
    "displayText": "Data {\"<string constant>\"|<numeric constant>}[,...]",
    "snippet": "Data $0",
    "description": "The Data statement can be used to populate the values of variables.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Data",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Delete",
    "displayText": "Delete",
    "snippet": "Delete #${1:FileNumber}: $0",
    "description": "Deletes the currently locked record from the identified data file..",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Delete_(statement)",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Dim",
    "displayText": "Dim",
    "snippet": "Dim $0",
    "description": "Declares Variables and Arrays. Arrays must be declared if they have other then 10 messages.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Dim",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Display",
    "displayText": "Display [Menu|Buttons] ...",
    "snippet": "Display $0",
    "description": "Display or Update the Windows Menu, or the Button Rows.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Display",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "End",
    "displayText": "End",
    "snippet": "End$0",
    "description": "Ends your program (continuing with any proc files that ran your program, or stopping if your program wasn't run from a proc.)",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=End",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Execute",
    "displayText": "Execute \"BR Command\"",
    "snippet": "Execute \"${1:BR Command}\"$0",
    "description": "Executes a Command from within one of your programs.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Execute",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Execute",
    "displayText": "Execute \"System [-c -M] <External Program>\"",
    "snippet": "Execute \"System ${1:External Program}\"",
    "description": "Launches an external program.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Execute",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Execute",
    "displayText": "Execute \"System [-c -M] start <URL>\"",
    "snippet": "Execute \"System -c -M start ${1:URL}\"",
    "description": "Launches a web URL in the default browser.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Execute",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Exit",
    "displayText": "Exit <error condition line ref>[,...]",
    "snippet": "Exit $0",
    "description": "Works in conjunction with the Exit error condition to list a bunch of error handlers in one place. ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Exit",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Exit",
    "displayText": "Exit Do",
    "snippet": "Exit Do$0",
    "description": "Jumps out of a do loop to the line following the loop.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Exit_do",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Print",
    "displayText": "Print \"<String>\"",
    "snippet": "print ${1:string}$0",
    "description": "Prints a line to the console, or to a specific file.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Print",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Input",
    "displayText": "Input <Variables>",
    "snippet": "Input ${1:Variables}",
    "description": "Reads text from the user or from a display file (like a text file). It can also read text from a proc file, if the program is called from a proc.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Input",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Linput",
    "displayText": "Linput <StringVariable>",
    "snippet": "Linput #${1:FileNumber} : ${2:Variable}$",
    "description": "Reads a line of text from a display file. This is useful for parsing CSV files and other files generated by external applications.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Linput",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Print",
    "displayText": "Print #<FileNumber/Printer> Using \"<Form Specs>\" : <String$>",
    "snippet": "Print Using$0",
    "description": "Prints formatted output using a form statement to format the provided variables.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Print_Using",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Print",
    "displayText": "Print #0 Border : <Application Title>",
    "snippet": "Print #0, Border: \"${1:Application Title}\"$0",
    "description": "Print Border Statement",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Print_Border",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Print",
    "displayText": "Print Fields",
    "snippet": "print fields ${1:fieldspecs}: ${2:data}\n$0",
    "description": "Displays a bunch of controls on the screen at once.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Print_Fields",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Input",
    "displayText": "Input Fields",
    "snippet": "input fields ${1:fieldspecs}: ${2:data}\n$0",
    "description": "Activates a bunch of controls on the screen and pauses execution, allowing the user to interact with them. This is the primary way that BR programs interact with the User.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Input_Fields",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Rinput",
    "displayText": "Rinput Fields",
    "snippet": "rinput fields ${1:fieldspecs}: ${2:data}\n$0",
    "description": "Updates and then activates a bunch of controls on the screen and pauses execution, allowing the user to interact with them. This is the primary way that BR programs interact with the User.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Rinput",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Input",
    "displayText": "Input Select",
    "snippet": "rinput select ${1:fieldspecs}: ${2:data}\n$0",
    "description": "Activates a bunch of controls and allows the user to select one of them.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Input_Select",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Rinput",
    "displayText": "Rinput Select",
    "snippet": "rinput fields ${1:fieldspecs}: ${2:data}\n$0",
    "description": "Activates and Displays a bunch of controls and allows the user to select one of them.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Rinput_select",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "For",
    "displayText": "Form",
    "snippet": "Form ${1:formspecs}$0",
    "description": "The Form statement is used in conjunction with PRINT, WRITE, REWRITE, READ or REREAD statements to format input or output. FORM controls the size, location, field length and format of input or output.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Form",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Gosub",
    "displayText": "Gosub <LineLabel/LineNumber>",
    "snippet": "Gosub ${1:LineLabel} $0",
    "description": "Calls a subroutine, which runs until it encounters a return statement, at which point it returns here.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Gosub",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Goto",
    "displayText": "Goto <LineLabel/LineNumber>",
    "snippet": "goto ${1:LineLabel}$0",
    "description": "Jumps to the target line and continues running from there. (Try not to use Goto Statements. This is not the 80s.).",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Goto",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Library",
    "displayText": "Library \"<Library>\" : <fnFunction1> [, fnFunction2] [, ...]",
    "snippet": "library \"${1:Library}\" : ${2:fnFunction1} $0",
    "description": "Loads a BR Libary, allowing access to the library functions in it.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Library",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Mat",
    "displayText": "Mat <array name> [(<dimension>[,...])] = ....",
    "snippet": "mat  ${1:ArrayName}",
    "description": "The Mat statement is used for working with Arrays. Its used to resize arrays, sort them (in conjunction with AIDX or DIDX), copy them, and process them in lots of other ways.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Mat",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "On",
    "displayText": "On <Error Condition> <action>",
    "snippet": "On  ${1:ErrorCondition} ${2:Action}",
    "description": "Registers an error handler for an error condition.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=On_Error",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "On",
    "displayText": "On Fkey <integer> <action>",
    "snippet": "On Fkey ${1:FkeyValue} ${2:Action}",
    "description": "Registers a line of code to run and ties it to the pressing of a specific fkey button.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=On_FKey",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "On",
    "displayText": "On <variable> Gosub <LineLabel>[,LineLabel]...",
    "snippet": "On ${1:variable} Gosub ${2:LineLabel}",
    "description": "Runs one of the subroutines based on the value in the variable.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=On_GoSub",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Open",
    "displayText": "Open #<FileNumber> \"Name=...\"",
    "snippet": "Open #${1:FileNumber} : \"name=${2:FileName}\"${3:FileReadTypes}",
    "description": "Opens a file or window or http connection or comm port.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Open",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Paus",
    "displayText": "Pause",
    "snippet": "Pause$0",
    "description": "Pauses program execution allows the programmer to interact with the program in the Command Console.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Pause",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Randomize",
    "displayText": "Randomize",
    "snippet": "Randomize$0",
    "description": "Generates a new Random Number Seed for the Random Number Generator (based on the system clock so as to be truly random).",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Randomize",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Read",
    "displayText": "Read #<file>, using form$(<file>) : <mat f$>, <mat f> eof Ignore",
    "snippet": "Read #${1:FileNumber}, using form$(${1:FileNumber}) : mat ${1:F}$, mat ${1:F} error Ignore $0",
    "description": "Reads the next record or line in the selected data file or data statements, storing the information in the variables provided.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Read",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Read",
    "displayText": "Read #<file number> [, USING {<formStatement>}] : <Variables> ",
    "snippet": "Read #${1:FileNumber}, using ${2:FormSpec} : ${3:Variables}",
    "description": "Reads the next record or line in the selected data file or data statements, storing the information in the variables provided.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Read",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Reread",
    "displayText": "Reread  #<file number> [, USING {<formStatement>}] : <Variables> ",
    "snippet": "Reread #${1:FileNumber}, using ${2:FormSpec} : ${3:Variables}",
    "description": "Rereads the previous record read again, in the selected data file or data statements, storing the information in the variables provided.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Reread",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Write",
    "displayText": "Write  #<file number> [, USING {<formStatement>}] : <Variables> ",
    "snippet": "write #${1:layout}, using Form$(${1:layout}) : Mat ${1:layout}$,Mat ${1:layout}",
    "description": "Adds a record to the file containing the information from the variables you list.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Write",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Rewrite",
    "displayText": "Rewrite  #<file number> [, USING {<formStatement>}] : <Variables> ",
    "snippet": "Rewrite #${1:FileNumber}, using ${2:FormSpec} : ${3:Variables}",
    "description": "Updates the record that is locked in the file (usually the last record read), with the data in the variables now.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Rewrite",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Restore",
    "displayText": "Restore  #<file number> [,<Key|Rec|Pos|Search> = <SearchValue|Position>: ",
    "snippet": "Restore #${1:FileNumber}: $0",
    "description": "Jumps to the beginning (or other specified point) in the targeted file.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Restore",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Retry",
    "displayText": "Retry",
    "snippet": "Retry$0",
    "description": "Jumps to the line that had the most recent error. Used to try again in an Error Handler.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Retry",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Return",
    "displayText": "Return",
    "snippet": "Return$0",
    "description": "Exits a Subroutine and returns control back up to the code following the Gosub statement.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Return",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Scr_Freeze",
    "displayText": "Scr_Freeze",
    "snippet": "scr_freeze$0",
    "description": "Stops the screen from updating, significantly increasing the speed of the programs. The screen starts running again at the next Input Statement or Scr_Thaw statement.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Scr_freeze",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Scr_Thaw",
    "displayText": "Scr_Thaw",
    "snippet": "scr_thaw$0",
    "description": "Causes the screen to refresh and begin updating again after it was frozen with a Scr_Freeze command.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Scr_thaw",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Stop",
    "displayText": "Stop",
    "snippet": "Stop$0",
    "description": "Ends your program (continuing with any proc files that ran your program, or stopping if your program wasn't run from a proc.)",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Stop",
    "leftLabel": "Statement",
    "type": "statement"
  },
  {
    "text": "Trace",
    "displayText": "Trace [On|Off|Print]",
    "snippet": "trace $0",
    "description": "Displays or outputs the line numbers as they're executed. Used for debugging code, but the modern debugging tools are much better.",
    "descriptionMoreURL": "http://www.brwiki.com/index.php?search=Trace",
    "leftLabel": "Statement",
    "type": "statement"
  }
]
