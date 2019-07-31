module.exports = [
  {
    "text": "BR_FileName$",
    "displayText": "BR_FileName$(<OS_Filename>)",
    "snippet": "BR_FileName$(${1:OS_Filename$})$0",
    "description": "Returns the BR Filename version of the specified OS filename (reversing out your Drive statements).",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=BR_FileName$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "BRErr",
    "displayText": "BRErr$",
    "snippet": "BRErr$$0",
    "description": "Returns a description of the most recent error encountered.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=BRErr$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "CForm$",
    "displayText": "CForm$(<Form>)",
    "snippet": "CForm$(${1:Form$})$0",
    "description": "Compiles a form statement for faster use and a smaller size string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=CForm$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Chr$",
    "displayText": "Chr$(<Number>)",
    "snippet": "Chr$(${1:Number})$0",
    "description": "Returns a Character from the ASCII table.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Chr$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Cnvrt$",
    "displayText": "Cnvrt$(<Spec>,<Number>)",
    "snippet": "Cnvrt$(${1:Spec$},(${2:Number})$0",
    "description": "Converts a number to a string, by packing it into the specified Form spec.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Cnvrt$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Date$",
    "displayText": "Date$(<days>,[<format$>])",
    "snippet": "Date$(${1:DaysJulian},\"${2:MMDDYY}\")$0",
    "description": "Returns the current date, or converts a specific Julain date to a string Date.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Date$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Decrypt$",
    "displayText": "Decrypt$(<string>[,<Algorithm>])",
    "snippet": "Decrypt$(${1:String$})$0",
    "description": "Unencrypts data encrypted with the encrypt keyword. (doesn't work on MD5, which cannot be unencrypted.)",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Decrypt$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Decrypt$",
    "displayText": "Decrypt$(<string>,\"MD5\")",
    "snippet": "Decrypt$(${1:String$},\"MD5\")$0",
    "description": "Unencrypts data encrypted with the encrypt keyword. (doesn't work on MD5, which cannot be unencrypted.)",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Decrypt$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Encrypt$",
    "displayText": "Encrypt$(<string>[,<Algorithm>])",
    "snippet": "Encrypt$(${1:String$})$0",
    "description": "Encrypts a string using one of a few common algorythms including MD5.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Encrypt$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Encrypt$",
    "displayText": "Encrypt$(<string>,\"MD5\")",
    "snippet": "Encrypt$(${1:String$},\"MD5\")$0",
    "description": "Encrypts a string using one of a few common algorythms including MD5.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Encrypt$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Env$",
    "displayText": "Env$(<VariableName>)",
    "snippet": "Env$(\"${1:VariableName}\")$0",
    "description": "Returns the contents of an Environment Variable.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Env$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "File$",
    "displayText": "File$(<Number>)",
    "snippet": "File$(${1:Number})$0",
    "description": "Returns the file name of the file specified.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=File$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "HELP$",
    "displayText": "HELP$(<topic>[,<filename>])",
    "snippet": "Help$(\"${1:HelpTopic}\")$0",
    "description": "Displays the requested Help Topic from the HelpFile specified by the HELPDFLT config specification.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Help$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Hex$",
    "displayText": "Hex$(<string>)",
    "snippet": "Hex$(${1:String$})$0",
    "description": "Converts the given string to Hexidecimal.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Hex$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "KStat$",
    "displayText": "KStat$([<Integer>])",
    "snippet": "KStat$$0",
    "description": "Returns keystrokes from the keyboard buffer.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=KStat$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Login_Name$",
    "displayText": "Login_Name$([<UserName>])",
    "snippet": "Login_Name$$0",
    "description": "Returns the Windows User Name of the person logged in. The optional parameter can be used to Override Login_Name with another name.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Login_Name$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "LPad$",
    "displayText": "LPad$(<string>)",
    "snippet": "LPad$(${1:String$})$0",
    "description": "Pads a string on the left with spaces (or optionally, any other character).",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=LPad$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "LTrm$",
    "displayText": "LTrm$(<string>)",
    "snippet": "LTrm$(${1:String$})$0",
    "description": "Trims off any spaces (or optionally any other specific character) from the left of the given string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=LTrm$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Lwrc$",
    "displayText": "Lwrc$(<string>)",
    "snippet": "Lwrc$(${1:String$})$0",
    "description": "Converts the given string to Lowercase.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Lwrc$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Max$",
    "displayText": "Max$(<string>)",
    "snippet": "Max$(${1:String$})$0",
    "description": "Finds the String with the greatest ASCII value of the given strings.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Max$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Min$",
    "displayText": "Min$(<string>)",
    "snippet": "Min$(${1:String$})$0",
    "description": "Finds the String with the lowest ASCII value of the given strings.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Min$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Msg$",
    "displayText": "Msg$(<string>)",
    "snippet": "Msg$(${1:String$})$0",
    "description": "Displays custom text in the Status Line at the bottom of the BR Command Console window.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Msg$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "OS_FileName$",
    "displayText": "OS_FileName$(<BR_FileName>)",
    "snippet": "OS_FileName$(${1:BR_FileName})$0",
    "description": "Returns the OS file name of the Specified BR Filename, taking into account the Drive statements.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=OS_FileName$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Pic$",
    "displayText": "Pic$(<CurrencySymbol>)",
    "snippet": "Pic$(${1:CurrencySymbol$})$0",
    "description": "Sets or displays the Currency Symbol used by the PIC form statement.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Pic$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Program",
    "displayText": "Program$",
    "snippet": "Program$$0",
    "description": "Returns the currently active program.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Program$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "RPad$",
    "displayText": "RPad$(<string>)",
    "snippet": "RPad$(${1:String$})$0",
    "description": "Pads a string on the right with spaces (or optionally, any other character).",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=RPad$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Rpt$",
    "displayText": "Rpt$(<string>,<repeat>)",
    "snippet": "Rpt$(${1:String$},${2:RepeatTimes})$0",
    "description": "Repeat the given character or string the specified number of times.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Rpt$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "RTrm$",
    "displayText": "RTrm$(<string>)",
    "snippet": "RTrm$(${1:String$})$0",
    "description": "Trims off any spaces (or optionally any other specific character) from the right of the given string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=RTrm$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Session",
    "displayText": "Session$",
    "snippet": "Session$$0",
    "description": "Returns the current Session$ number, which is 2 digits identifying the Workstation number, and 1 digit identifying the Session.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Session$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "SRep$",
    "displayText": "SRep$<String$>[,<StartSearchPos>],<SearchFor$>,<ReplaceWith$>",
    "snippet": "SRep$(${1:String$},${2:SearchFor$},${3:ReplaceWith$})$0",
    "description": "Search the given string and replace all occurances of the first string with the second string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=SRep$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Str$",
    "displayText": "Str$(<number>)",
    "snippet": "Str$(${1:number$})$0",
    "description": "Converts the given number to string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Str$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Time",
    "displayText": "Time$",
    "snippet": "Time$$0",
    "description": "Returns the current System Time.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Time$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Trim$",
    "displayText": "Trim$(<string>)",
    "snippet": "Trim$(${1:String$})$0",
    "description": "Trims all spaces off both ends of the given string.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Trim$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "UnHex$",
    "displayText": "UnHex$(<string>)",
    "snippet": "UnHex$(${1:String$})$0",
    "description": "Converts Hexidecimal to Characters.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=UnHex$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "UprC$",
    "displayText": "UprC$(<string>)",
    "snippet": "UprC$(${1:String$})$0",
    "description": "Converts the given string to Uppercase.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=UprC$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "UserID",
    "displayText": "UserID$",
    "snippet": "UserID$$0",
    "description": "Returns the licensee information from the BR logfile.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=UserID$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Variable",
    "displayText": "Variable$",
    "snippet": "Variable$$0",
    "description": "Returns the Variable associated with the last Error, or if no error, the last variable processed by BR.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=Variable$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "WBPlatform",
    "displayText": "WBPlatform$",
    "snippet": "WBPlatform$$0",
    "description": "Displays the Operating System that BR is running under.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=WBPlatform$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "WBVersion",
    "displayText": "WBVersion$",
    "snippet": "WBVersion$$0",
    "description": "Displays the current version of Business Rules.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=WBVersion$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "WSID",
    "displayText": "WSID$",
    "snippet": "WSID$$0",
    "description": "Displays the WSID$, a 2 digit unique identifier for this computer.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?search=WSID$",
    "leftLabel": "String",
    "type": "function"
  },
  {
    "text": "Xlate$",
    "displayText": "Xlate$(<string>,<translation string>[,<position>])",
    "snippet": "Xlate$(${1:String$},${2:TranslationTable$})$0",
    "description": "Returns a string translated using a second string as a translation table.",
    "descriptionMoreURL": "http://brwiki2.brulescorp.com/index.php?title=Xlate$",
    "leftLabel": "String",
    "type": "function"
  }
]
