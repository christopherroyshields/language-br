proc noecho 
00001 dim Infile$*256,Outfile$*256 
00002 Infile$="design.brs" 
00003 Outfile$="tempfile" 
subproc linenum.brs 
run 
clear 
subproc tempfile 
skip PROGRAM_REPLACE if exists("design") 
skip PROGRAM_REPLACE if exists("design.br") 
save "design.br" 
skip XIT 
:PROGRAM_REPLACE 
replace "design.br" 
skip XIT 
:XIT 
system 
