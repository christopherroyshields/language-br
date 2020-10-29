module.exports = [
  {
    "text": "ABS",
    "displayText": "ABS(<numeric expression>)",
    "snippet": "abs(${1:expression})",
    "description": "Returns the Absolute Value of a Number.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Abs",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Mat",
    "displayText": "Mat <Array> ... Aidx(Array)",
    "snippet": "Mat ${1:indexedArray}(udim(${2:}))=aidx(${2:})",
    "description": "Returns an array that is an ascending index obtained from sorting the array within parenthesis.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Aidx",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Aidx",
    "displayText": "Aidx(Array)",
    "snippet": "aidx(${1:})",
    "description": "Returns an array of Subscripts that is an ascending index obtained from sorting the array within parenthesis.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=aidx",
    "leftLabel": "Integer Array",
    "type": "function"
  },
  {
    "text": "Atn",
    "displayText": "Atn(<numeric expression>)",
    "snippet": "Atn(${1:numeric expression})",
    "description": "A trigonometric function that calculates the arctangent of the numeric expression in radians.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Atn",
    "leftLabel": "Float",
    "type": "function"
  },
{
    "text": "Bell",
    "displayText": "Bell",
    "snippet": "bell$0",
    "description": "Returns a character which, when printed, sounds the printer's or terminal's bell. It is used mainly in PRINT statements.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Bell",
    "leftLabel": "Special",
    "type": "function"
  },
  {
    "text": "Ceil",
    "displayText": "Ceil(<numeric expression>)",
    "snippet": "Ceil(${1:Float})",
    "description": "Calculates the smallest integer greater than or equal to X.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Ceil",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "CmdKey",
    "displayText": "CmdKey",
    "snippet": "CmdKey",
    "description": "Returns a value to identify the last command key (function key) used to terminate keyboard input, or returns 0 if <ENTER> was the last key pressed.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CmdKey",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Cnt",
    "displayText": "Cnt",
    "snippet": "Cnt",
    "description": "Returns the number of data items successfully processed by the last I/O statement.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Cnt",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Cod",
    "displayText": "Code",
    "snippet": "code",
    "description": "Indicates the termination status of a program as set by the STOP or END statement.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Code",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "CoS",
    "displayText": "CoS(<numeric expression>)",
    "snippet": "cos(${1:Float})$0",
    "description": "Trigonometric function that calculates the cosine of X in radians.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CoS",
    "leftLabel": "Float",
    "type": "function"
  },
{
    "text": "CurCol",
    "displayText": "CurCol",
    "snippet": "CurCol",
    "description": "Returns cursor column from the last INPUT FIELDS or RINPUT FIELDS statement.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CurCol",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "CurFld",
    "displayText": "CurFld",
    "snippet": "CurFld",
    "description": "Returns the number of the field containing the cursor from the last INPUT FIELDS.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CurFld",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "CurRow",
    "displayText": "CurRow",
    "snippet": "CurRow",
    "description": "Returns the cursor's row from last Input Fields or RInput Fields statement.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CurRow",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "CurTab",
    "displayText": "CurTab",
    "snippet": "CurTab",
    "description": "Returns the active tabbed window number.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CurTab",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "CurWindow",
    "displayText": "CurWindow",
    "snippet": "CurWindow",
    "description": "Returns the number of the window currently in focus.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CurWindow",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Date",
    "displayText": "Date([<Integer>], [*<order_of_components$>])",
    "snippet": "Date(${1:mdy})",
    "description": "Calculates and returns dates in numeric format, using no dashes or slashes as separators.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Date",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Days",
    "displayText": "Days(<date>[,<format$>])",
    "snippet": "days(${1:date$},${2:mask$})$0",
    "description": "Returns the absolute, sequential value which is assigned to dates after January 1, 1900.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Days",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Debug_Str",
    "displayText": "Debug_Str(<message-level>, <string-value>)r",
    "snippet": "debug_str(${1:10},\"${2:String}\")",
    "description": "Depending on loglevel (message-level must be equal or lower), send data to the logfile as well as to the debugger if it is attached, or optionally to the command console if the debugger is not attached and GUI is ON.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Debug_Str",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Didx",
    "displayText": "Didx(<array name>)",
    "snippet": "mat ${1:indexArray}(udim(${2:arrayToBeIndexed}$))=aidx(${2:arrayToBeIndexed}$)",
    "description": " returns an array that is a descending index obtained from sorting the array named.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=DIdx",
    "leftLabel": "Integer Array",
    "type": "function"
  },
{
    "text": "Err",
    "displayText": "Err",
    "snippet": "Err",
    "description": "Returns the error code of the most recent error.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Err",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Exists",
    "displayText": "Exists(<filename>)",
    "snippet": "exists($1:${filename$})",
    "description": "The exists internal function returns a nonzero value if the specified file (PROC or program)exists and the user has read privileges. If one or both of these conditions is false, exists returns a value of zero. NOTE that on single-user systems, all files have read privileges for the current user.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Exists",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Exp",
    "displayText": "Exp(<numeric expression>)",
    "snippet": "exp(${1:x})",
    "description": "Calculates the exponential value of X.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Exp",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "File",
    "displayText": "File(<file handle>)",
    "snippet": "file(${1:filenum})$0",
    "description": "The File internal function returns the numeric value that specifies the status of file associated with the File Handle.\n-1 \tFile not opened.\n0 \tOperation performed successfully.\n10 \tEnd of file occurred during input.\n11 \tEnd of file occurred during output.\n20 \tTransmission error during input.\n21 \tTransmission error during output.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=File_(internal_function)",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Filenum",
    "displayText": "Filenum",
    "snippet": "filenum",
    "description": "returns the number of the file that produced the most recent I/O error.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=FileNum",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Fkey",
    "displayText": "Fkey(<value>)",
    "snippet": "fkey(${1:fkey})$0",
    "description": "Similar to CmdKey, but returns more information, particularly about how a field is exited.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=FKey",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Fp",
    "displayText": "Fp(<numeric expression>)",
    "snippet": "fp(${1:number})",
    "description": "Returns the fractional part of X. ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=FP",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Freesp",
    "displayText": "Freesp(<file name>)",
    "snippet": "freesp(${1:n})$0",
    "description": "Returns the number of free (unused) bytes on the drive containing file N.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=FreeSp",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Inf",
    "displayText": "Inf",
    "snippet": "Inf",
    "description": "Returns the largest possible number in Business Rules! on the current system.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Inf",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Int",
    "displayText": "Int(<numeric expression>)",
    "snippet": "Int($)",
    "description": "Returns the largest integer less than or equal to X.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Int",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Ip",
    "displayText": "Ip(<numeric expression>)",
    "snippet": "ip(${1:float})",
    "description": "Returns the integer part of X.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=IP",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "KLN",
    "displayText": "KLN(<file name>[,<numeric expression>])",
    "snippet": "kln(${filename$})$0",
    "description": "Returns the key length in bytes for master file specified by 'file name'.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=KLn",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Kps",
    "displayText": "Kps(<file name> [,<numeric expression>])",
    "snippet": "kps(${1:filename$})",
    "description": "Returns the byte position where the key for master file named starts. With an optional second parameter, KPS can also return the position of a section of a key when split keys are used.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=KPs",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "KRec",
    "displayText": "KRec(N)",
    "snippet": "KRec(${1:filenum})",
    "description": "When file N is a display file, KRec(N) acts as a line counter for lines output to the file. If file N is an internal file opened for Keyed processing, then KRec(N) returns the number of the last record accessed in the key file.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=KRec",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Len",
    "displayText": "Len(<string>)",
    "snippet": "len(${string}$)$0",
    "description": "The Len(string$) internal function returns the number of characters in variable string$.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Len",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Line",
    "displayText": "Line",
    "snippet": "line",
    "description": "Returns the line number of the most recent error. ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Line",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Lines",
    "displayText": "Lines(<file number>)",
    "snippet": "lines(${1:filenum})",
    "description": "Returns the number of lines printed since the last new page.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=aidx",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "LineSPP",
    "displayText": "LineSPP(<file number>)",
    "snippet": "linespp(${1:filenum})$0",
    "description": "Returns the current lines per page as set by a BRConfig.sys PRINTER spec's LPP parameter or 66 by default.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=LineSPP",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Log",
    "displayText": "Log(<positive number>)",
    "snippet": "log(${1:number})$0",
    "description": "Returns the natural logarithm of its argument.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Log",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Lrec",
    "displayText": "Lrec(<file handle>)",
    "snippet": "lrec(${1:filenum})$0",
    "description": "Returns the number of the last record in the file.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=LRec",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Mat2Str",
    "displayText": "Mat2Str(MAT <Array Name>, <String Variable> [, [MAT] <Delimiter$>] [, \"<Quote-Type>] [:] [<trim>]\")r",
    "snippet": "mat2str( MAT ${1:array$}, ${2:str$}, \",\")",
    "description": "Mat2Str internal function which converts an array to a string",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Mat2Str",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Max",
    "displayText": "Max(<value>,<value>[,...])",
    "snippet": "max(${1:number},${2:number})",
    "description": "Returns the largest numeric value in the set of numbers inside parentheses (X1, X2 and so on).",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Max",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Min",
    "displayText": "Min(<value>,<value>[,...])",
    "snippet": "Min",
    "description": "The Min internal function returns the smallest numeric value in the set of numbers inside parentheses (X1, X2 and so on). ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Min",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Mod",
    "displayText": "Mod(<numerator>, <denominator>)",
    "snippet": "Mod",
    "description": "The Mod internal function returns the remainder of the numerator divided by the denominator. In other words, it is the remainder left after the division of one integer by another ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Mod",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Msg",
    "displayText": "Msg(\"<KB>\",<string>)",
    "snippet": "Msg",
    "description": "The MSG internal function (without the dollar sign) is only available for Windows & CS versions. This should not be confused with Msg$.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Msg",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Msgbox",
    "displayText": "Msgbox(<PROMPT$>[, <TITLE$>][, <BUTTONS$>][, <ICON$>])",
    "snippet": "msgbox('${1:what is my purpose?}','${2:Title}','${3:Yn}','${icon$}')",
    "description": "The MsgBox Internal Function will display a Windows Message Box. It has four possible parameters.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=MsgBox",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Newpage",
    "displayText": "Newpage",
    "snippet": "newpage",
    "description": "The NewPage internal function returns a character which, when printed, causes the printer to do a form feed or the screen to clear.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=NewPage",
    "leftLabel": "Special",
    "type": "function"
  },
  {
    "text": "Ord",
    "displayText": "Ord(<string>)",
    "snippet": "ord(${string}$)$0",
    "description": "ASCII ordinate value (from 0 to 255) of the first character in the string$.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Ord",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Pi",
    "displayText": "Pi",
    "snippet": "pi",
    "description": "Returns the mathematical constant of 3.14159265358979",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Pi",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Pos",
    "displayText": "Pos(<string>,[^]<string>,[[-]<start>])",
    "snippet": "Pos(${1:A$},${2:B$})$0",
    "description": "Returns the position of the first character of a substring in str1$ that matches str2$.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Pos",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Printer_List",
    "displayText": "Printer_List(<Mat array name>)",
    "snippet": "printer_list(mat ${1:A}$)$0",
    "description": "Reads the list of available Windows printers into the provided array (mat a$). Returns the number of available printers.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=abs",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "ProcIn",
    "displayText": "ProcIn",
    "snippet": "procin",
    "description": "Returns 0 if input is from the screen. Returns 1 if input is from a procedure file.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=ProcIn",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "Rec",
    "displayText": "Rec(<file ref>)",
    "snippet": "rec(${1:filenum})$0",
    "description": "Returns the number of the record last processed in file N.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Rec",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Rem",
    "displayText": "Rem(<numerator>, <denominator>)",
    "snippet": "rem(${1:numberator},${2:denominator})",
    "description": "Returns the remainder of the numerator divided by the denominator.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Rem_(internal_function)",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "RLn",
    "displayText": "RLn(<file handle>[,<new record length>])",
    "snippet": "rln(${1:filenum},${2:newlength})$0",
    "description": "returns the record length of an open file handle N.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=RLn",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "RND",
    "displayText": "RND[(<numeric expression>)]",
    "snippet": "int(rnd*${1:100}+1)$0",
    "description": "Returns a random number between 0 and 1.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Rnd",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Round",
    "displayText": "Round(<numeric expression>,<decimals>)",
    "snippet": "round(${1:number})",
    "description": "Calculates the value of the first value rounded to the specified number of decimal places. ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Round",
    "leftLabel": "Float",
    "type": "function"
  },
{
    "text": "Serial",
    "displayText": "Serial",
    "snippet": "serial",
    "description": "returns the serial number assigned to this copy of Business Rules!. ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Serial",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "SetEnv",
    "displayText": "SetEnv(<field>,<value>)",
    "snippet": "setenv(${1:field},${2:value})$0",
    "description": "Sets session based environmental variables in Business Rules!.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=SetEnv",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Sgn",
    "displayText": "Sgn(<X>)",
    "snippet": "sgn(${1:number})$0",
    "description": "Returns a value which identifies whether a numeric value is negative, positive or zero.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Sgn",
    "leftLabel": "Integer",
    "type": "function"
  },
{
    "text": "Sin",
    "displayText": "Sin",
    "snippet": "sin(${1:number})$0",
    "description": "Trigonometric function that returns the sine of X in radians.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Sin",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Sleep",
    "displayText": "Sleep(<seconds>)",
    "snippet": "sleep(${1:seconds})$0",
    "description": "The Sleep internal function causes the processor to wait the specified number of seconds before continuing execution. It does not tie up the processor while waiting, which is especially important for multi-user systems.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Sleep",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Sqr",
    "displayText": "Sqr(<numeric expression>)",
    "snippet": "sqr(${1:number})$0",
    "description": "Returns the square root of its argument.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Sqr",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Srch",
    "displayText": "Srch(<array-name$>,[^]<argument$>[,<row>])",
    "snippet": "srch(mat ${1:a}$,'^${2:search}')$0",
    "description": "Searches an array and returns the row number matching the argument.\nIf the argument is not found, then either 0 (BR 4.1 and below) or -1 (BR 4.2 and above).\nThe argument must be the same data type (string or numeric) as the array. The optional \"row\"\nparameter defines the starting array element for the search.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Srch",
    "leftLabel": "Integer",
    "type": "function",
    "params": ["mat array$", "argument$", "start"]
  },
  {
    "text": "Str2Mat",
    "displayText": "Str2Mat(<string variable>, MAT <array name>, [MAT] <delimiter$>, [<quote-type:trim>])t",
    "snippet": "str2mat(${1:string}$,mat ${2:array}$,\"${3:,}\")$0",
    "description": "The Str2Mat Internal Function will split a string variable based on a\ndelimiter and place the resulting strings into an array which STR2MAT\ndynamically re-dimensions. The string to mat and mat to string functions\nhave been extended to ease parsing of CSV and XML data (as of 4.3).",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=absStr2Mat",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Sum",
    "displayText": "Sum(<numeric array>)",
    "snippet": "sum(${1:NumberArray})$0",
    "description": "The Sum internal function returns the sum of all the elements in the numeric array named.\nSUM also works with multi-dimensional matrices.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Sum",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Tab",
    "displayText": "Tab(<col>)",
    "snippet": "tab(${1:col})$0",
    "description": "The Tab(x) internal function positions the cursor at column x (similar to POS in a FORM statement), where x is any numeric expression.\nIf the current position of the line is greater than column x, the cursor is positioned at column x in the next line.\nIf x is negative, TAB(1) is assumed. If x is not an integer, it is rounded.\nIf x is greater than the record length, the cursor is positioned at column 1 in the next line.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Tab",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "Tan",
    "displayText": "Tan(<x>)",
    "snippet": "tan(${1:number})$0",
    "description": "The Tan internal function is a mathematical trigonometric function that calculates the tangent of X in radians. ",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Tan",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "Timer",
    "displayText": "Timer",
    "snippet": "timer$0",
    "description": "The Timer internal function returns a \"Real Number\" with 5 decimal digits accuracy with the number of seconds elapsed since midnight, January 1, 1970.\nThis starting point is obtained from the operating system so it is only as accurate as your system time.\nThis value is used internally by the pro filer to monitor performance, but may be used within programs to measure the time very accurately",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Timer",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "UDim",
    "displayText": "UDim(<array name> [,<dimension>])",
    "snippet": "udim(${1:array})$0",
    "description": "The UDim(A$,X) internal function returns the number of rows in the array if X=1. Returns the number of columns in the array if X=2. Returns the current size of dimensions 3, 4, 5, 6 or 7 when X is 3, 4, 5, 6 or 7. If the optional parameter X is omitted, UDIM returns the size of the first dimension.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=UDim",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "VAL",
    "displayText": "VAL(<string>)",
    "snippet": "val(${1:string})$0",
    "description": "The Val(A$) internal function returns A$ expressed as a numeric value rather than a string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Val",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "Version",
    "displayText": "Version(<file_handle>)",
    "snippet": "version(${1:filenum})$0",
    "description": "The Version internal function affects an open internal data file.\nIt will return the version of that file. It can also be used to set the version.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Version",
    "leftLabel": "Integer",
    "type": "function"
  }
]
