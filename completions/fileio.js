module.exports = [
  {
    "text": "fnGetFileNumber",
    "displayText": "fnGetFileNumber(;start,count)",
    "snippet": "fnGetFileNumber$0",
    "description": `
    Returns the next available file handle.

    fnGetFileNumber(;Start,Count)

      Start – Which Number to start looking from. Defaults to 1.
      Count - How many file numbers to find in a row. fnGetFileNumber will search for a gap of at least this many unused numbers in a row.`,

    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnGetFileNumber",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "fnShowData",
    "displayText": "fnShowData(Filelay$*128, ...)",
    "snippet": "fnShowData(\"${1:layout}\")$0",
    "description": `

    Loads the BR Data Crawler to View or Edit the current data file. Many options exist for filters and other options.

    def library fnShowData(FileLay$;Edit,sRow,sCol,Rows,Cols,KeyNumber,Caption$*127,Path$*255,KeyMatch$*255,SearchMatch$*255, CallingProgram$*255, mat Records, mat IncludeCols$, mat IncludeUI$, mat ColumnDescription$, mat ColumnWidths, mat ColumnForms$, DisplayField$*80, mat FilterFields$, mat FilterForm$, mat FilterCompare$, mat FilterCaption$, mat FilterDefaults$, mat FilterKey)

      FileLay$ - the file layout you want to display
      Edit - 1 for Edit (Grid) and 0 for View (Listview)
      sRow, sCol - the start position. if not given, its centered.
      Rows, Cols - the size. If not given, defaults to fullscreen.
      KeyNumber - Which Key to use, defaults to Relative. Required if KeyMatch$ is given.
      Caption$ - the Caption to display, defaults to \"FileIO's Datacrawler\"

      See the online documentation for a complete description of all optional parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnShowData",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnEmpty",
    "displayText": "fnEmpty(mat A)",
    "snippet": "fnEmpty(mat ${1:array})$0",
    "description": `
    Returns true if the passed array is empty.

    fnEmpty(mat Numeric)
      mat Numeric - Numeric Array to Test

    See also fnEmptyS if you need to test a String Array.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnEmpty_.26_fnEmptyS",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnEmptyS",
    "displayText": "fnEmptyS(mat A$)",
    "snippet": "fnEmptyS(mat ${1:array}$)$0",
    "description": `
    Returns true if the passed array is empty.

    fnEmptyS(mat String$)
      mat String$ - String Array to Test

    See also fnEmpty if you need to test a Numeric Array.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnEmpty_.26_fnEmptyS",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnCsvImport",
    "displayText": "fnCsvImport(Layout$*64;SupressDialog,FileName$*300,ImportModeKey)",
    "snippet": "fnCsvImport(\"${1:layout}\")$0",
    "description": `
    Imports the specified file into the specified layout, showing or optionally suppressing the CSV File Import Dialog.

    fnCsvImport(Layout$*64; SuppressDialog, FileName$*300, ImportModeKey)

      Layout$ - The file layout to import into
      SupressDialog - 1 to Supress the Import Dialog
      FileName$ - the name of the CSV file (Required if Dialog is Suppressed)

      See the online documentation for a complete description of all optional parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCSVImport",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCsvExport",
    "displayText": "fnCsvExport(Layout$*64;DialogType,FileName$*300,IncludeRecNums,KeyNumber, ...)",
    "snippet": "fnCsvExport(\"${1:layout}\")$0",
    "description": `
    Exports the specified file to CSV.

    fnCsvExport(Layout$*64;SuppressDialog,Filename$*300,IncludeRecNums,KeyNumber,StartKey$,KeyMatch$,Startrec,mat Records,SearchMatch$)

      Layout$ - The File Layout to Export
      SuppressDialog - (1 to Suppress the Export Dialog, 0 to show it)
      Filename$ - the output file name (Required if SuppressDialog is 1)

      See the online documentation for a complete description of all optional parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCSVExport",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnAskCombo$",
    "displayText": "fnAskCombo$*255(mat Description$;Caption$*60,Default$*255)",
    "snippet": "fnAskCombo$(mat ${1:Description}$)$0",
    "description": `
    Displays a selection window to the user and allows them to select one option. Returns that selection.

    fnAskCombo$*255(mat Description$;Caption$*60,Default$*255)

      mat Description$ - contains the combo box choices
      Caption$ - contains the optional caption for the window
      Default$ - the text of the item in mat Description$ that you want to be selected by default`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnAskCombo",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnBuildProcFile",
    "displayText": "fnBuildProcFile(String$*255)",
    "snippet": "fnBuildProcFile(${1:Command})$0",
    "description": `
    Builds a proc file to be run later. See fnRunProcFile.

    Example:
      let fnBuildProcFile(\"load \"&Program2$)
      let fnBuildProcFile(\"run\")
      let fnBuildProcFile(\"system\")

      let fnRunProcFile(1)`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnBuildProcFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnRunProcFile",
    "displayText": "fnRunProcFile(;NoWait)",
    "snippet": "fnRunProcFile$0",
    "description": `
    Runs the proc file built previously. See fnBuildProcFile.

    Example:
      let fnBuildProcFile(\"load \"&Program2$)
      let fnBuildProcFile(\"run\")
      let fnBuildProcFile(\"system\")

      let fnRunProcFile(1)`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnRunProcFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReIndexAllFiles",
    "displayText": "fnReIndexAllFiles",
    "snippet": "fnReIndexAllFiles$0",
    "description": `
    Reindexes all data files.

    fnReIndexAllFiles`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReIndexAllFiles",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReIndex",
    "displayText": "fnReIndex(DataFile$*255;CallingProgram$*255,IndexNum,Path$*255)",
    "snippet": "fnReIndex(\"${1:layout}\")$0",
    "description": `
    Reindexes the specified data file. If an optional IndexNum is passed, only that index is rebuilt.

    fnReIndex(DataFile$*255;CallingProgram$*255,IndexNum,Path$*25)

      Datafile$ - the file layout of the file to index

    See the online documentation for a full description of all parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReIndex",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnRemoveDeletes",
    "displayText": "<success/fail> fnRemoveDeletes(LayoutName$*255;Path$*255,CallingProgram$*255,DontError)",
    "snippet": "fnRemoveDeletes(\"${1:layout}\")$0",
    "description": `
    Removes deleted records for the given data file, by copying it with the -D option.

    fnRemoveDeletes(LayoutName$*255;Path$*255,CallingProgram$*255)

      LayoutName$ - the file layout`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnRemoveDeletes",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnReadEntireLayout",
    "displayText": "<count> fnReadEntireLayout(LayoutName$*255;&FileName$,&Prefix$,mat Keys$, ...)",
    "snippet": "fnReadEntireLayout(\"${1:layout}\",${1:&filename}$,${1:&prefix}$,mat ${1:keys}$)$0",
    "description": `
    Reads the file layout and returns the information in a bunch of arrays. Returns the field count.

    fnReadEntireLayout(Layoutname$*255;&Filename$,&Prefix$,Mat Keys$,Mat KeyDescription$,Mat Ssubs$,Mat Nsubs$,Mat Sspec$,Mat Nspec$,Mat Sdescription$,Mat Ndescription$,Mat Spos,Mat Npos)

      LayoutName$ - Name of the layout to read
      Filename$ - The file name read from the layout
      prefix$ - the return value for the prefix for the file
      Mat Keys$ - Array to be populated with the list of keys for the file
      Mat KeyDescription$ - Key Description String returned from the file
      mat SSubs$ - the return value for all the string subscripts in the layout
      mat NSubs$ - the return value for the numeric subscripts in the layout

      See the online documentation for a full description of all parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadEntireLayout",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "fnReadLayoutHeader",
    "displayText": "<count> fnReadLayoutHeader(LayoutName$*255;&FileName$,mat Keys$,mat KeyDescription$, ...)",
    "snippet": "fnReadLayoutHeader(\"${1:layout}\",${2:&filename}$,mat ${3:keys}$)$0",
    "description": `
    Reads the file layout and returns the Header information in a bunch of arrays. Returns the number of keys.

    fnReadLayoutHeader(Layoutname$*255;&Filename$,Mat Keys$,Mat KeyDescription$)

      LayoutName$ - Name of the layout to read
      Filename$ - The file name read from the layout
      Mat Keys$ - Array to be populated with the list of keys for the file
      Mat KeyDescription$ - Key Description String returned from the file`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadLayoutHeader",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "fnReadLayoutArrays",
    "displayText": "<count> fnReadLayoutArrays(LayoutName$*255,&Prefix$;mat SSubs$,mat NSubs$, ...)",
    "snippet": "fnReadLayoutArrays(\"${1:layout}\",${2:&prefix}$,mat ${3:StringSubs}$,mat ${4:NumericSubs}$)$0",
    "description": `
    Reads the file layout and returns the Record Detail information in a bunch of arrays. Returns the field count.

    fnReadLayoutArrays(filelay$,&prefix$;mat SSubs$, mat NSubs$, mat SSpec$, mat NSpec$,mat SDescription$, mat NDescription$,Mat Spos,Mat Npos)

      filelay$ - the name of the layout to read
      prefix$ - the return value for the prefix for the file
      mat SSubs$ - the return value for all the string subscripts in the layout
      mat NSubs$ - the return value for the numeric subscripts in the layout

    See the online documentation for a full description of all parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadLayoutArrays",
    "leftLabel": "Integer",
    "type": "function"
  },

  {
    "text": "fnReadKeyFiles",
    "displayText": "fnReadKeyFiles(Layout$,mat Keys$)",
    "snippet": "fnReadKeyFiles(\"${1:layout}\",mat ${2:keys}$)$0",
    "description": `
    Reads the list of Keys for the given layout into the provided arrays.

    fnReadKeyFiles(Layout$,mat Keys$)

      Layout$ - The file layout
      mat Keys$ - output array, the keys are returned here.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadKeyFiles",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnBuildKey$",
    "displayText": "<key> fnBuildKey$*255(Layout$*30,mat F$,mat F;KeyNum)",
    "snippet": "fnBuildKey$(\"${1:layout}\",mat ${1:layout}$,mat ${1:layout})$0",
    "description": `
    Builds the key for the given record.

    FnBuildKey$(Layout$, Mat F$, Mat F; Keynum)

      Layout$ - the name of the data file to build the key for.
      Mat F$ - the string array of the file object
      Mat F - the numeric array of the file object
      KeyNum - This optional parameter specifies which of the key files in the given layout the key should be built for.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnBuildKey.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnCloseFile",
    "displayText": "fnCloseFile(FileNumber, Filelay$*255; Path$*255,Out)",
    "snippet": "fnCloseFile(${1:layout}, \"${1:layout}\")$0",
    "description": `
    Closes the file, closing all indexes.

    fnCloseFile(filenumber,filelay$;path$)

      FileNumber – The filenumber of the file you are trying to close.
      FileLay$ - The name of the file layout for this file. This is used to determine how many keys the file would have been opened with and therefore how many we now need to close.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCloseFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReadForm$",
    "displayText": "<form statement> fnReadForm$*10000(FileLayout$)",
    "snippet": "fnReadForm$(\"${1:layout}\")$0",
    "description": `
    Returns the form statement for the given file.

    let FormStatement$=fnReadForm$*10000(FileLayout$)`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadForm.24_.28uncompiled.29",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnClearLayoutCache",
    "displayText": "fnClearLayoutCache",
    "snippet": "fnClearLayoutCache$0",
    "description": `
    Clears the current layout cache from memory, forcing FileIO to reread all layouts from the desk the next time they're used.
    `,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnClearLayoutCache",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnLength",
    "displayText": "fnLength(Spec$)",
    "snippet": "fnLength(${1:Spec})$0",
    "description": `
    Checks the given Field Spec and returns its length on disk in bytes.

    fnLength(Spec$)

      Spec$ - the Form Spec to return the length of.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnLength",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "fnDisplayLength",
    "displayText": "fnDisplayLength(Spec$)",
    "snippet": "fnDisplayLength(${1:Spec})$0",
    "description": `
    Checks the given Field Spec and returns the maximum length it could take on the screen in Characters.

    fnDisplayLength(Spec$)

      Spec - the Form Spec to return the display length of.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnDisplayLength",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "fnUpdateFile",
    "displayText": "fnUpdateFile(Filelayout$)",
    "snippet": "fnUpdateFile(\"${1:layout}\")$0",
    "description": `
    Checks the given file for updates to its layout, and triggers the update if there are any updates.

    fnUpdateFile(FileLayout$)

      FileLayout$ - The name of the file to update`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnUpdateFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReadDescription$",
    "displayText": "fnReadDescription$*255(FileNumber,Subscript,Key$*255,mat F$,mat F,mat Form$)",
    "snippet": "fnReadDescription$*255(${1:filenumber},${2:Subscript},${3:Key},mat ${1:f}$,mat ${1:f},mat Form$)$0",
    "description": `
    Reads the given open file, finds the record matching the given key, and returns the requested String Field.

    fnReadDescription$(Filehandle,Subscript,key$,mat F$,mat F,mat Form$)

      Number of an open file to read – File Handle for file to use.
      Subscript – The field to read.
      key$ - The key of the record to read.
      mat F$ & mat F - Work Variables to hold a file record from the file we are reading.
      mat Form$ - array of form statements.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadDescription.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadUnOpenedDescription$",
    "displayText": "fnReadUnOpenedDescription$*255(LayoutName$,Key$*255;Subscript)",
    "snippet": "fnReadUnOpenedDescription$*255(\"${1:layout}\",${2:Key},${3:OptionalSubscript})$0",
    "description": `
    Opens and Reads the given file, finding the record matching the given key, and returning the requested String Field. Defaults to the Second (2nd) String field (usually the description field).

    FnReadUnopenedDescription$(Layout$,key$*255;Field)

      Layout$ - the layout of the file we are reading
      key$ - the value of the key field in the record to be read
      Field - the element of the data file to return. If not given, this defaults to 2`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadUnopenedDescription.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadNumber",
    "displayText": "fnReadNumber(FileNumber,Subscript,Key$*255,mat F$,mat F,mat Form$)",
    "snippet": "fnReadNumber(${1:filenumber},${2:Subscript},${3:Key},mat ${1:f}$,mat ${1:f},mat Form$)$0",
    "description": `
    Reads the given open file, finds the record matching the given key, and returns the requested Numeric Field.

    fnReadNumber(Fl,subscript,key$,mat F$,mat F,mat fm$)

      Fl – File Handle for file to use (Route File).
      Subscript – Index of field in record to use (should be taken from file layout).
      Key$ - Item that should match a key in this file somewhere.
      mat F$ & mat F - Work Variables to hold a file record from the file we are reading.
      mat Fm$ - This will need to be our array of form statements, so the function can read the file properly.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadNumber",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "fnReadUnOpenedNumber",
    "displayText": "fnReadUnOpenedNumber(LayoutName$,Key$*255;Field,DontChangeKey)",
    "snippet": "fnReadUnOpenedNumber(\"${1:layout}\",${2:Key},${3:OptionalSubscript})$0",
    "description": `
    Opens and Reads the given file, finding the record matching the given key, and returning the requested Numeric Field. Defaults to the First (1st) Numeric field.

    fnReadUnopenedNumber(Layout$,key$*255;Field)

      Layout$ - the layout of the file we are reading
      key$ - the key of the record to be read
      Field - the element of the data file to return. If not given, this defaults to 2.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadUnopenedNumber",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "fnReadRelativeDescription$",
    "displayText": "fnReadRelativeDescription$*255(FileNumber,Subscript,RecordNumber,mat F$,mat F,mat Form$)",
    "snippet": "fnReadRelativeDescription$*255(${1:filenumber},${2:Subscript},${3:RecordNum},mat ${1:f}$,mat ${1:f},mat Form$)$0",
    "description": `
    Reads the given open file, reads the specified record, and returns the requested String Field.

    fnReadRelativeDescription$(FileNumber,SubscriptToRead,RecordNumber,mat F$,mat F,mat form$)

      Filenumber - The file number of the open data file
      SubscriptToRead - The subscript to read
      RecordNumber - the Record number to read
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat form$ - the forms array is also set by fnOpen.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadRelativeDescription.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadRelUnOpenedDescription$",
    "displayText": "fnReadRelUnOpenedDescription$*255(LayoutName$,RecordNumber;Field)",
    "snippet": "fnReadRelUnOpenedDescription$*255(\"${1:layout}\",${2:Record},${3:OptionalSubscript})$0",
    "description": `
    Opens and Reads the given file, reads the specified record, and returns the requested String Field. Defaults to the Second (2nd) String field (usually the description field).

    fnReadRelUnopenedDescription(Layout$,RecordNumber;Field)

      Layout$ - The file layout
      RecordNumber - the record to read
      Field - the field subscript to read`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadRelUnopenedDescription.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadRelativeNumber",
    "displayText": "fnReadRelativeNumber(FileNumber,Subscript,RecordNumber,mat F$,mat F,mat Form$)",
    "snippet": "fnReadRelativeNumber(${1:filenumber},${2:Subscript},${3:RecordNum},mat ${1:f}$,mat ${1:f},mat Form$)$0",
    "description": `
    Reads the given open file, reads the specified record, and returns the requested Numeric Field.
    fnReadRelativeNumber(FileNumber,SubscriptToRead,RecordNumber,mat F$,mat f,mat Form$)

      Filenumber - The file number of the open data file
      SubscriptToRead - The subscript to read
      RecordNumber - the Record number to read
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat form$ - the forms array is also set by fnOpen.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadRelativeNumber",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "fnReadRelUnOpenedNumber",
    "displayText": "fnReadRelUnOpenedNumber(LayoutName$,RecordNumber;Field)",
    "snippet": "fnReadRelUnOpenedNumber(\"${1:layout}\",${2:Record},${3:OptionalSubscript})$0",
    "description": `
    Opens and Reads the given file, reading the specified record, and returning the requested Numeric Field. Defaults to the First (1st) Numeric field.

    fnReadRelUnopenedNumber(LayoutName$,RecordNumber;Field)

      Layout$ - The file layout
      RecordNumber - the record to read
      Field - the field subscript to read`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadRelUnopenedNumber",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "fnReadRecordWhere$",
    "displayText": "fnReadRecordWhere$*255(LayoutName$,SearchSub,SearchKey$*255,ReturnSub)",
    "snippet": "fnReadRecordWhere$*255(\"${1:layout}\",${2:SearchInSubscript},${3:SearchFor},${4:ReturnSubscript})$0",
    "description": `
    Searches a file for a given value and reads the record where the specified subscript matches that value. Returns the Requested String from that Record.

    FnReadRecordWhere$(Layout$,SearchSub,SearchKey$*255,ReturnSub)

      Layout$ - the layout of the file we are searching
      SearchSub - Subscript of the element to look in
      SearchKey$ - The value we are looking for
      ReturnSub - Subscript of the element to return`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadRecordWhere.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnUniqueKey",
    "displayText": "fnUniqueKey(FileNumber,Key$*255)",
    "snippet": "fnUniqueKey(${1:layout},${2:testKey})$0",
    "description": `
    Checks to see if the given key would be unique in the given data file and returns true if it is.

    fnUniqueKey(Fl,key$*255)

      FL – The file number of the opened file.
      Key$ - This is the key to test.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnUniqueKey",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnReadAllKeys",
    "displayText": "fnReadAllKeys(FileNumber,mat F$,mat F,mat Form$,Sub1,mat Out1$;...)",
    "snippet": "fnReadALLKeys(${1:filenumber},mat ${1:f}$,mat ${1:f},mat Form$,${2:Subscript1},mat ${2:Out1}$)$0",
    "description": `
    Reads all records from the file and puts the value of 1 or 2 fields in an array(s).

    fnReadAllKeys(File,mat f$,mat f,mat fm$,sub1,mat out1$;sub2,mat out2$)

      File – The file handle for the already opened file in question.
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat fm$ - Array of Forms statement.
      Sub1 – Subscript of the element to return in the array
      mat out1$ - Array in which to return the data.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadAllKeys",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReadMatchingKeys",
    "displayText": "fnReadMatchingKeys(FileNumber,mat F$,mat F,mat Form$,Key$,KeyFld,Sub1,mat Out1$;Sub2,mat Out2$,Index)",
    "snippet": "fnReadmatchingKeys(${1:filenumber},mat ${1:f}$,mat ${1:f},mat Form$,${2:SearchString}$,${3:SearchField},${4:OutSub1},mat {4:Out1}$)$0",
    "description": `
    Reads all records from the file that match the given filter information, and puts the requested values in the requested arrays. A complete search is preformed and the filter field doesn't have to be indexed.

    fnReadMatchingKeys(Fl,mat f$,mat f,mat fm$,key$,keysub,sub1,mat out1$;sub2,mat out2$)

      FL – The file handle for the already opened file in question.
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat fm$ - Array of Forms statement.
      Key$ - Only records where the key field matches key$ will be returned.
      Keysub – This tells the function which element is the key element for this particular file number.
      Sub1 – Subscript of the element to return in the array
      mat out1$ - Array in which to return the data.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadMatchingKeys",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReadAllNewKeys",
    "displayText": "fnReadAllNewKeys(FileNumber,mat F$,mat F,mat Form$,Sub1,mat Out1$;Dont_Reset,Sub2,mat Out2$,Index)",
    "snippet": "fnReadAllNewKeys(${1:filenumber},mat ${1:f}$,mat ${1:f},mat Form$,${2:OutSub1},mat {2:Out1}$)$0",
    "description": `
    Reads any values from the file but doesn't double up values that already exist in the output arrays.

    FnReadAllNewKeys(Fl,mat f$,mat f,mat fm$,sub1,mat out1$; dont_reset,sub2,mat out2$)

      FL – The file handle for the already opened file in question.
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat fm$ - Array of Forms statement.
      Sub1 – Subscript of the element to return in the array
      mat out1$ - Array in which to return the data.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadAllNewKeys",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReadFilterKeys",
    "displayText": "fnReadFilterKeys(FileNumber,mat F$,mat F,mat Form$,Key$,KeyFLD,Sub1,mat Out1$;Filter$,Filter_Sub,ReadLarger,Sub2,mat Out2$, Sub3, mat Out3$, Sub4,mat Out4$, Index)",
    "snippet": "fnReadFilterKeys(${1:FileNumber},mat ${1:f}$,mat ${1:f},mat Form$,${2:Key}$,${3:KeyField},${4:OutSub1},mat {4:Out1}$)$0",
    "description": `
    Reads all keys that match the given filters and outputs up to 4 arrays from the matching records.

    fnReadFilterKeys(Fl,Mat F$,Mat F,Mat Fm$,Key$,Keyfld,Sub1,Mat Out1$;Filter$,Filter_Sub,Readlarger,Sub2,Mat Out2$, Sub3, Mat Out3$, Sub4,Mat Out4$)

      FL – The file handle for the already opened file in question.
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat fm$ - Array of Forms statement.
      Key$ - The key to search for in the read statements
      Keyfld – the subscript of the key field in the data file.
      Sub1 – Subscript of the element to return in the array
      mat out1$ - Array in which to return the data.
      Filter$ – This optional parameter identifies matches to search for in the records. it works in conjunction with Filter_Sub
      Filter_Sub – This parameter specifies which field to look for in the records for matches to Filter$. Only records which have Filter$ in the specified field will be returned.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadFilterKeys",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnMakeUniqueKey$",
    "displayText": "fnMakeUniqueKey$*255(FileNumber;Random,Prepend$)",
    "snippet": "fnMakeUniqueKey$*255(${1:FileNumber})$0",
    "description": `
    Generates a key that is unique in the given file.

    FnMakeUniqueKey$(fl)

      FL – This is the file number of the opened file for the desired key.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnMakeUniqueKey.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadLockedUsers",
    "displayText": "fnReadLockedUsers(mat Users$)",
    "snippet": "fnReadLockedUsers(mat ${1:Users}$)$0",
    "description": `
    Returns an array listing all the users that have locks on the most recently locked file.

    fnReadLockedUsers(mat Users$)

      mat Users$ - the list of users is returned here`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadLockedUsers",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnViewLogFile",
    "displayText": "fnViewLogFile(;ShowQuit,ShowColumns,ShowExport)",
    "snippet": "fnViewLogFile$0",
    "description": `
    Loads the FileIO Log File in a listview for viewing.

    fnViewLogFile(;ShowQuit,ShowColumns,ShowExport)

      ShowQuit - Show a quit button on the UI (if off, ESC will quit).
      ShowColumns - Include a button to allow the user to select which columns to view.
      ShowExport - Include a button to export the log file to CSV.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnViewLogFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnErrLog",
    "displayText": "fnErrLog(String$*255;CallingProgram$*255)",
    "snippet": "fnErrLog(\"${1:LogMessage}\",Program$)$0",
    "description": `
    Logs an error message to the log file.

    FnErrLog(String$)

      String$ - the Log Message`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnLog_.26_fnErrLog",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnSetLogChanges",
    "displayText": "fnSetLogChanges(mat F$,mat F)",
    "snippet": "fnSetLogChanges(mat ${1:f}$,mat ${1:f})$0",
    "description": `
    Records the given arrays so that differences can be logged later with fnLogChanges.
    `,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnSetLogChanges",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnLogChanges",
    "displayText": "fnLogChanges(mat F$,mat F;String$*1048,CallingProgram$*255,Layout$)",
    "snippet": "fnLogChanges(mat ${1:f}$,mat ${1:f})$0",
    "description": `
    Examines the passed arrays and records a log message describing just the changes.
    `,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnLogChanges",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnLogArray",
    "displayText": "fnLogArray(mat F$,mat F;String$*512,CallingProgram$*255)",
    "snippet": "fnLogArray(mat ${1:f}$,mat ${1:f})$0",
    "description": `
    Writes a log message to the Log that lists all details of the passed in Arrays.
    `,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnLogArray",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnLog",
    "displayText": "fnLog(String$*512;CallingProgram$*255,ForceTextFile)",
    "snippet": "fnLog(\"${1:LogMessage}\",Program$)$0",
    "description": `
    Records a message to the log file.

FnLog(string$)

  String$ - the Log Message`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnLog_.26_fnErrLog",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnNotInFile",
    "displayText": "fnNotInFile(String$*100,FileName$,Sub;Path$,FileNumber)",
    "snippet": "fnNotInFile(${1:SearchString},\"${1:layout}\",${3:SearchField})$0",
    "description": `
    Returns true if the specified value is not found in the specified field of the file.

    fnNotInFile(string$*100,filename$,sub)

      String$ - Value to check for uniqueness in this file.
      Filename$ - This is the name of the file layout of the file you want to check.
      Sub – This is the subscript value of the element you are checking.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnNotInFile",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnGetFileDateTime$",
    "displayText": "fnGetFileDateTime$(FileName$*255)=FNGetFileDT$(FileName$)",
    "snippet": "fnGetFileDateTime$(${1:FileName})$0",
    "description": `
    Reads the last modified date and time of the specified file from the filesystem.

    let FileDate$=fnGetFileDateTime$(Filename$*255)`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnGetFileDateTime.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadLayouts",
    "displayText": "fnReadLayouts(mat LayoutList$)",
    "snippet": "fnReadLayouts(mat DirList$=)$0",
    "description": `
    Reads the list of file layouts into the provided array.

    FnReadLayouts(mat Dirlist$)

      Mat Dirlist$ - After running the function, mat Dirlist$ will contain a list of all the file layouts that FileIO can find.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadLayouts",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnDirVersionHistoryFiles",
    "displayText": "fnDirVersionHistoryFiles(Layout$,mat DirList$;BypassExtension$)",
    "snippet": "fnDirVersionHistoryFiles(\"${1:layout}\",mat ${2:LayoutList}$)$0",
    "description": `
    Reads a list of all the version history files available for the given layout into the provided array.

    fnDirVersionHistoryFiles(Layout$,mat DirList$;BypassExtension$)

      Layout$ - Which layout to look up version history of
      Mat Dirlist$ - After running the function, mat Dirlist$ will contain a list of all previous versions from history of the requested layout.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnDirVersionHistoryFiles",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnDoesLayoutExist",
    "displayText": "fnDoesLayoutExist(Layout$)",
    "snippet": "fnDoesLayoutExist(${1:layout}$)$0",
    "description": `
    Returns true if the specified layout exists.

    FnDoesLayoutExist(layout$)

      Layout$ - Layout to test for`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnDoesLayoutExist",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnReadLayoutPath$",
    "displayText": "fnReadLayoutPath$",
    "snippet": "${1:layoutPath}$=fnReadLayoutPath$$0",
    "description": `
    Returns the path to the FileIO layout folder.

    let Path$=fnReadLayoutPath$`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadLayoutPath.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnReadLayoutExtension$",
    "displayText": "fnReadLayoutExtension$",
    "snippet": "${1:layoutExtension}$=fnReadLayoutExtension$$0",
    "description": `
    Returns the File Layout Extension`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnLayoutExtension.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnKey$",
    "displayText": "fnKey$*255(FileNumber, Key$*255)",
    "snippet": "fnKey$*255(${1:FileNumber}, ${2:Key}$)$0",
    "description": `
    Takes the passed in value and ensures that its the proper size for the key of the given file number.
    let Key$=FnKey$(FileNumber, Key$)

      FileNumber - the file number we are formatting the key for
      Key$ - the key we are trying to format.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnKey.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnSortKeys",
    "displayText": "fnSortKeys(mat Keys$,Layout$,DataFile,mat F$,mat F,mat Form$;KeyNUM)",
    "snippet": "fnSortKeys(mat ${1:Keys}$,\"${1:layout}\",${2:filenumber},mat ${3:f}$,mat ${3:f},mat Form$)$0",
    "description": `
    Sorts the records indicated by mat Keys$ into an order speciied by the key identified by Keynum.
    fnSortKeys(mat Keys$,Layout$,DataFile,mat F$,mat F,mat Form$;KeyNum)

      mat Keys$ - the array of keys. These keys are based on whatever key the file was opened with in DataFile.
      Layout$ - the file layout for the file.
      DataFile - the File Handle matching the keys array given.
      mat F$ and mat F - the arrays to hold the data. They must match the dimensions and should be set with fnOpen.
      mat Form$ - Array of Forms statement.
      KeyNum - This is the key that we'll sort based on. Defaults to 1.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnSortKeys",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnBeginAudit",
    "displayText": "fnBeginAudit(;BackupFolder$*80,Path$*255,mat SelectedFiles$)",
    "snippet": "fnBeginAudit$0",
    "description": `
    Records the beginning point of the specified datafiles (defaults to all) so that a subsequent fnCompare operation can be performed to make a report showing all changes made.

    fnBeginAudit(BackupFolder$)

      BackupFolder$ - the name of a folder to backup the Audit Information to. If it does not exist, it is created.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=AuditBR#fnBeginAudit",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCompare",
    "displayText": "fnCompare(;BackupFolder$*80,LogFile$*80,PRINTER,DontClose,Path$*255,mat SelectedLayouts$)",
    "snippet": "fnCompare$0",
    "description": `
    Run after running fnBeginAudit, to see a report of any changes made to the specified data files since the time of running fnBeginAudit.

    fnCompare(BackupFolder$;Logfile$,Printer,DontClose)

      BackupFolder$ - the name of a folder containing a backup of your datafiles. Use fnBeginAudit to create and to update this folder.
      Logfile$ - The name of a logfile to report all changes to.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=AuditBR#fnCompare",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCopyDataFiles",
    "displayText": "fnCopyDataFiles(BackupFolder$*255;Path$*255,mat SelectedLayouts$,SKIPKeys)",
    "snippet": "fnCopyDataFiles(${1:BackupFolder}$)$0",
    "description": `
    Copies all (or optionally some) of the data files defined in your file layouts to the folder specified as the BackupFolder.

    fnCopyDataFiles(DestinationFolder$*255)

      DestinationFolder$ - the folder to copy your data files to.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCopyDataFiles",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCopyFile",
    "displayText": "fnCopyFile(FromFile$*255,ToFile$*255;NoProgressBar)",
    "snippet": "fnCopyFile(${1:FromFile$},${2:ToFile$})$0",
    "description": `
    Copies the specified file, even over the internet (using Client Server), showing a progress bar as the copy progresses.

    fnCopyFile(FromFile$*255,ToFile$*255)

      FromFile$ - The file to copy.
      ToFile$ - The destination file name including path.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCopyFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCopyFile",
    "displayText": "fnCopyFile Download from Server to Client",
    "snippet": "fnCopyFile(${1:FromFile$},\"@:\"&${1:ToFile$})$0",
    "description": `
    Downloads the specified file, showing a progress bar as the copy progresses.

    fnCopyFile(FromFile$*255,ToFile$*255)

      FromFile$ - The file to copy.
      ToFile$ - The destination file name including path.  Use \"@:\" to indicate a file on the client.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCopyFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCopyFile",
    "displayText": "fnCopyFile Upload from Client to Server",
    "snippet": "fnCopyFile(\"@:\"&${1:FromFile$},${1:ToFile$})$0",
    "description": `
    Uploads the specified file, showing a progress bar as the copy progresses.

    fnCopyFile(FromFile$*255,ToFile$*255)

      FromFile$ - The file to copy.  Use \"@:\" to indicate a file on the client
      ToFile$ - The destination file name including path.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCopyFile",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnProgressBar",
    "displayText": "fnProgressBar(Percent;Color$, ... )",
    "snippet": "fnProgressBar(${1:CurrentRecord}/${2:LastRecord})$0",
    "description": `
    Call in the MainLoop of a slow routine to display a progress bar that runs during the process. Automatically opens a window for the progress bar that needs to be closed using fnCloseBar when done.

    fnProgressBar(Percent;Color$,ProgressAfter,ProgressThreshhold,UpdateThreshhold,Caption$*255,MessageRow$*255)

      Percent - Percentage Complete expressed as a float between 0 and 1
      Color$ - HTML Color Code of BR Color Attribute to color the Progress Bar. Defaults to Green.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnProgressBar",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnProgressBar",
    "displayText": "fnProgressBar(Percent) of a DataFile",
    "snippet": "fnProgressBar(rec(${1:DataFile})/lrec(${1:DataFile}))$0",
    "description": `
    Call in the MainLoop of a slow routine to display a progress bar that runs during the process. Automatically opens a window for the progress bar that needs to be closed using fnCloseBar when done.

    fnProgressBar(Percent;Color$,ProgressAfter,ProgressThreshhold,UpdateThreshhold,Caption$*255,MessageRow$*255)

      Percent - Percentage Complete expressed as a float between 0 and 1
      Color$ - HTML Color Code of BR Color Attribute to color the Progress Bar. Defaults to Green.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnProgressBar",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnCloseBar",
    "displayText": "fnCloseBar",
    "snippet": "fnCloseBar$0",
    "description": `
    Closes the progress bar window when the task is done.

    fnCloseBar`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCloseBar",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnShowMessage",
    "displayText": "fnShowMessage(Message$*54)",
    "snippet": "fnShowMessage(\"${1:Message}\")$0",
    "description": `
    Opens a child window and displays a message in it, returning the child window number, so that the window can be closed when done.

    WindowNumber=fnShowMessage(Message$*54)

      Message - the Message to display to the user`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnShowMessage",
    "leftLabel": "Integer",
    "type": "function"
  },
  {
    "text": "fnClientEnv$",
    "displayText": "fnClientEnv$*255(EnvKey$)",
    "snippet": "fnClientEnv$(\"${1:EnvironmentVariable}\")$0",
    "description": `
    Returns the value of an Environment variable on the Client, when running under Client Server. (Env$ on Client Server shows only Environment Variables on the Server).

    fnClientEnv$*255(EnvKey$)

      EnvKey$ is the name of the Windows Environment Variable to check on the client.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnClientEnv.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnExportListViewCsv",
    "displayText": "fnExportListViewCsv(Window,Spec$;GenFileName,Delimiter$,FileName$*255)",
    "snippet": "fnExportListViewCsv(${1:Window},${2:Spec}$)$0",
    "description": `
    Exports the specified listview in CSV format.

    fnExportListViewCsv(Window,Spec$;GenFileName,Delim$,FileName$*255)

      Window - The Window containing the listview.
      Spec$ - The Spec identifying the listview.
      GenFileName - Flag telling weather or not to generate the file name.
      Delim$ - Delimiter to use. Comma is default.
      Filename$ - Filename to use`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnExportListViewCsv",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnSendEmail",
    "displayText": "fnSendEmail(EmailAddress$*255,EmailMessage$*10000;Subject$*255,InvoiceFile$*255,NOPrompt,BccEmail$*255,mat CcEmailS$,CcAsTo)",
    "snippet": "fnSendEmail(${1:EmailAddress}$,${2:EmailMessage$})$0",
    "description": `
    Sends an email to the specified address. Returns a flag showing if it was successful or not.

    fnSendEmail(Emailaddress$*255,Message$*10000;Subject$*255,Invoicefile$*255)

      EmailAddress$ - the Destination Email Address
      Message$ - the Message$ to send
      Subject$ - the subject
      InvoiceFile$ - the filename of a file to attach.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnSendEmail",
    "leftLabel": "Boolean",
    "type": "function"
  },
  {
    "text": "fnStandardTime$",
    "displayText": "fnStandardTime$(MilitaryTime$;Seconds)",
    "snippet": "fnStandardTime$(${1:MilitaryTime}$)$0",
    "description": `
    Converts Military Time (24 hr) to Standard Time (am/pm).

    fnStandardTime$(MilitaryTime$;Seconds)

      MilitaryTime$ - Time in 24 hr format.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnStandardTime.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnMilitaryTime$",
    "displayText": "fnMilitaryTime$(StandardTime$;Seconds)",
    "snippet": "fnMilitaryTime$(${1:StandardTime}$)$0",
    "description": `
    Converts Standard Time (am/pm) to Military Time (24 hr).

    fnMilitaryTime$(StandardTime$;Seconds)

      StandardTime$ - Time in AM/PM Format`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnMilitaryTime.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnCalculateHours",
    "displayText": "fnCalculateHours(TimeIn$,TimeOut$,DaysIN,DaysOut)",
    "snippet": "fnCalculateHours(${1:TimeIn},${2:TimeOut},${3:DaysIn},${4:DaysOut})$0",
    "description": `
    Calculates the amount of time that passed between Tin and Tout in Hours.

    fnCalculateHours(TimeIn$,TOut$,DaysIN,DaysOut)

      TimeIn$ - From Time
      TimeOut$ - To Time
      DaysIn - Days Start
      DaysOut - Days End`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnCalculateHours",
    "leftLabel": "Float",
    "type": "function"
  },
  {
    "text": "fnBuildTime$",
    "displayText": "fnBuildTime$(Hours,Minutes,Seconds,PM;Military,UseSeconds)",
    "snippet": "fnBuildTime$(${1:Hours},${2:Minutes},${3:Seconds},${4:PM})$0",
    "description": `
    Builds a time string from Hours, Minutes, and Seconds.

    fnBuildTime$(H,M,S,P;Military,Seconds)

      H - Hours
      M - Minutes
      S - Seconds
      P - Boolean indicating AM/PM - 0 is AM, 1 is PM
      Military - Flag indicating weather desired result is in Military Time or not
      Seconds - Flag indicating weather to count seconds or ignore them. (1 means count seconds)`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnBuildTime.24",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "fnParseTime",
    "displayText": "fnParseTime(TimeString$,&Hours,&Minutes,&Seconds,&PM)",
    "snippet": "fnParseTime(${1:TimeString}$,${2:&Hours},${3:&Minutes},${4:&Seconds},${5:&PM})$0",
    "description": `
    Parses a time string and returns the Hours, Minutes, and Seconds.

    fnParseTime(T$,&H,&M,&S,&P)

      T$ - the time to parse
      H - Return value for Hours
      M - Return value for Minutes
      S - Return value for Seconds
      P - Return Value for AM/PM`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnParseTime",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnSubstituteStringCode",
    "displayText": "fnSubstituteStringCode(&String$,Code$*2048;SubstituteChar$)",
    "snippet": "fnSubstituteStringCode(${1:&String}$,${2:Code}$)$0",
    "description": `
    Substitutes the information in String according to the results of executing the code in Code$

    fnSubstituteStringCode(&String$,Code$*2048;SubstituteChar$)

      String$ - the string to be searched
      Code$ - code to be run. The resulting variables can be substituted into String
      SubstituteChar$ - Defaults to [] but here you can override the Substitute Character to be used.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnSubstituteStringCode",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnSubstituteString",
    "displayText": "fnSubstituteString(&String$,Filelayout$,mat F$,mat F;SubstituteChar$)",
    "snippet": "fnSubstituteString(${1:&String}$,\"${2:Filelayout}\",mat ${2:F}$,mat ${2:F})$0",
    "description": `
    Substitutes any File References in the passed String with their matches from the given record.

    fnSubstituteString(&String$,Filelayout$,mat F$,mat F;SubstituteChar$)

      String$ - the string to be searched
      FileLayout$ - the layout to be searched
      mat F$ - the record to be used for substitution
      mat F - the record to be used for substitution
      SubstituteChar$ - Defaults to [] but here you can override the Substitute Character to be used.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnSubstituteString",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnReadScreenSize",
    "displayText": "fnReadScreenSize(&RowS,&Cols;Window)",
    "snippet": "fnReadScreenSize((${1:&RowS},${2:&Cols})$0",
    "description": `
    Returns the size of the specified window in Rows and Columns.

    fnReadScreenSize(&Rows,&Cols;Window)

      Rows & Cols - returns the screen size in rows and columns.
      Window - the window to interrogate. If not given, assumes Window 0.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnReadScreenSize",
    "leftLabel": "None",
    "type": "function"
  },
  {
    "text": "fnOpen",
    "displayText": "fnOpen(LayoutName$, Mat F$, Mat F, Mat Form$; Input, KeyNum)",
    "snippet": "fnOpen(\"${1:layout}\",mat ${1:layout}$,mat ${1:layout},mat form$,0,1)$0",
    "description": `
    Opens file using Fileio, returning the file handle

    fnOpen(Filename$*255, Mat F$, Mat F, Mat Form$; Inputonly, Keynum, DontSortSubs, Path$*255, Mat Descr$, Mat FieldWidths, SupressPrompt, IgnoreErrors, SuppressLog)

      FileName$ - The filename of the file layout for the file you’re reading.
      MAT F$ - The array that will be used to hold the string data for the file.
      MAT F – The array that will hold the numeric data for the file.
      MAT Form$ - An array of form statements.
      InputOnly – 1 means open for input only.

      See the online documentation for a complete description of all optional parameters.`,
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=FileIO_Library#fnOpen",
    "leftLabel": "Integer",
    "type": "function"
  },
]
