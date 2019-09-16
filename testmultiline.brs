! testMultiline.br ! Test case for multiline string support

let Name$="Chris"
let Year=2019

! #Autonumber# 100,10
let msgbox( !_
   "'"&`This is a multiline
   String handled by "Lexi"
   These were invented by {{Name$}} in {{Year}}.
   `)

   /* This is a multiline comment in Lexi
   Handled like a c++
   multiline comment */

   def library fnCsvExport(Layout$*64; !_    The file layout to export
                           DialogType, !_    Dialog Option Specs for layout
                           Filename$*300, !_ Filename to export to
                           IncludeRecNums) ! Boolean flag to export Rec Nums

      ! Some code
      ! Some more code

   fnend
