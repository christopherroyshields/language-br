 ! testMultiline.br ! Test case for multiline string support

 let Name$="Chris"
 let Year=2019

 ! #Autonumber# 100,10
 let msgbox( !_
   "'"&`This is a multiline
    String handle``d by "Lexi"
    These were invented by {{Name$}} in {{Year}}.
    `)

    /* This is a multiline comment in Lexi
    Handled like a pro
    c++ multiline comment */

    execute "list"
