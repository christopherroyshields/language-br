00010     dim String$*4000 ! #Autonumber# 10,10
00015     dim Infile$*255
00020     dim Const$(1)*800
00030     dim Constname$(1)*30
00040     dim Currentselect$*400
00050     dim Currentcase$(1)*400
00060     dim AfterString$*4000
00070     let Increment=1
00080     let Labelincrement=10
00090     mat Constname$(0)
00100     mat Const$(0)
00110     open #1: "name="&Infile$, display, input
00120     open #2: "name="&Outfile$&", recl=800, replace", display, output
00130  READLINE: linput #1: String$ eof DONEREADING
00135     if not SkipNextOne and (ltrm$(String$)(1:1)="!" and pos(String$,"!")>3) then let String$(1:4)=" ! ."&ltrm$(string$(1:4))
00140     for Constindex=1 to Udim(Mat Const$)
00150        if (Constantposition:=Pos(Uprc$(String$),Uprc$(Constname$(Constindex)))) then
00160           let String$=String$(1:Constantposition-1) & Const$(Constindex) & String$(Constantposition+Len(Constname$(Constindex)):Len(String$))
00170        END IF  ! end if
00180     next Constindex
00190     if (Constantposition:=Pos(Uprc$(String$),"#DEFINE#")) then
00200        let Constantposition+=8
00210        if (Constnamestartpos:=Pos(String$,"[[",Constantposition)) then
00220           if (Constnameendpos:=Pos(String$,"]]",Constnamestartpos)) then
00230              let Constnameendpos+=1
00240              mat Const$(Constindex:=(Udim(Mat Const$)+1))
00250              mat Constname$(Constindex)
00260              let Constname$(Constindex)=String$(Constnamestartpos:Constnameendpos)
00270              let Const$(Constindex)=Trim$(String$(Constnameendpos+2:Len(String$)))
00280              if Const$(Constindex)(1:1)="=" then ! If Equals, Then Ignore It
00290                 let Const$(Constindex)=Trim$(Const$(Constindex)(2:Len(Const$(Constindex))))
00300              END IF  ! end if
00310              if Const$(Constindex)(1:1)='"' And Const$(Constindex)(Len(Const$(Constindex)):Len(Const$(Constindex)))='"' then
00320                 let Const$(Constindex)=Const$(Constindex)(2:Len(Const$(Constindex))-1) ! Remove Quotes If Both Are Present
00330              END IF  ! end if
00340           END IF  ! end if
00350        END IF  ! end if
00360     END IF  ! end if
00370     if (Selectposition:=Pos(Uprc$(String$),"#SELECT#")) then
00380        if (Caseposition:=Pos(Uprc$(String$),"#CASE#",Selectposition)) then
00390           let Currentselect$=String$(Selectposition+8:Caseposition-1)
00400           let Caseindex=0
00410           let Currentcasechunk=Caseposition+6
00420           do
00430              let Caseindex+=1
00440              mat Currentcase$(Caseindex)
00450              if (Nextcasechunk:=Pos(String$,"#",Currentcasechunk)) then
00460                 let Currentcase$(Caseindex)=String$(Currentcasechunk:Nextcasechunk-1)
00470                 let Currentcasechunk=Nextcasechunk+1
00480              else
00490                 let Currentcase$(Caseindex)=String$(Currentcasechunk:Len(String$))
00500              END IF  ! end if
00510           loop While Nextcasechunk
00520           let Afterstring$=" THEN  ! " & String$(SelectPosition:Len(String$))
00530           let String$=String$(1:SelectPosition-1) & "IF "
00540           for Caseindex=1 to Udim(Mat Currentcase$)
00550              if Caseindex>1 then
00560                 let String$=String$ & " or "
00570              END IF  ! end if
00580              let String$=String$ & Trim$(Currentselect$) & " = " & Trim$(Currentcase$(Caseindex))
00590           next Caseindex
00600           let String$ = String$ & Afterstring$
00610        END IF  ! end if
00620     else if (Caseposition:=Pos(Uprc$(String$),"#CASE#")) then
00630        if Len(Trim$(Currentselect$)) then
00640           let Caseindex=0
00650           let Currentcasechunk=Caseposition+6
00660           do
00670              let Caseindex+=1
00680              mat Currentcase$(Caseindex)
00690              if (Nextcasechunk:=Pos(String$,"#",Currentcasechunk)) then
00700                 let Currentcase$(Caseindex)=String$(Currentcasechunk:Nextcasechunk-1)
00710                 let Currentcasechunk=Nextcasechunk+1
00720              else
00730                 let Currentcase$(Caseindex)=String$(Currentcasechunk:Len(String$))
00740              END IF  ! end if
00750           loop While Nextcasechunk
00760           let Afterstring$=" THEN  ! " & String$(Caseposition:Len(String$))
00770           let String$=String$(1:Caseposition-1) & "ELSE IF "
00780           for Caseindex=1 to Udim(Mat Currentcase$)
00790              if Caseindex>1 then
00800                 let String$=String$ & " or "
00810              END IF  ! end if
00820              let String$=String$ & Trim$(Currentselect$) & " = " & Trim$(Currentcase$(Caseindex))
00830           next Caseindex
00840           let String$ = String$ & Afterstring$
00850        END IF  ! end if
00860     else if (Caseposition:=Pos(Uprc$(String$),"#CASE ELSE#")) then
00870        if Len(Trim$(Currentselect$)) then
00880           let String$ = String$(1:Caseposition-1) & "ELSE " & String$(Caseposition+11:Len(String$)) & " ! " & String$(Caseposition:Len(String$))
00890        END IF  ! end if
00900     else if (Endposition:=Pos(Uprc$(String$),"#END SELECT#")) then
00910        let String$ = String$(1:EndPosition-1) & "END IF" & String$(EndPosition+12:len(String$)) & "  ! " & String$(EndPosition:len(String$))
00920        let Currentselect$ = ""
00930     END IF  ! end if
00940     if (Newnumber:=Pos(Uprc$(String$),"#AUTONUMBER#")) then
00950        let Temp=0
00960        let Temp=Val(String$(Newnumber+12:Newincrement:=Pos(String$,",",Newnumber+12))) conv BADAUTONUMBER
00970        if Temp=0 then goto BADAUTONUMBER
00980        let Newlinecount=Temp
00990        if Newlinecount<=Linecount then print "AUTONUMBER ERROR IN "&Str$(Lastlinecount)&" TO "&Str$(Newlinecount)&" AUTONUMBER SECTION" : close #1: : close #2: : execute ("*FREE "&Outfile$) : print Bell : pause : execute ("SYSTEM")
01000        let Lastlinecount=Linecount=Newlinecount
01010        let Increment=Val(String$(Newincrement+1:4000)) conv BADAUTONUMBER
01020        let Linecount-=Increment ! Decrement So Next Increment Is Correct
01030     END IF  ! end if
01040     if (Ltrm$(Uprc$(String$))(1:1)="L") And (Newnumber:=Pos(Ltrm$(Uprc$(String$))(1:7),":")) then
01050        let Newlinecount=Val(Ltrm$(Uprc$(String$))(2:Newnumber-1)) conv BADAUTONUMBER
01060        if (Newlinecount>Linecount) then
01070           let Linecount=Newlinecount
01080           if Mod(Linecount,Labelincrement)=0 then let Increment=Labelincrement
01090           let Linecount-=Increment ! Decrement So Next Num Is Correct
01100        else
01110           let Increment=Max(Int(Increment/2),2) ! Cut Incr In Half To Catch Up
01120        END IF  ! end if
01130     END IF  ! end if
01140  BADAUTONUMBER: ! Ignore Line Number Information
01150     let X=0
01160     let X = Val(String$(1:5)) conv ADDLINENUMBER
01170     if X>0 then goto PRINTLINE
01180  ADDLINENUMBER: !
01190     if Not Skipnextone then
01200        if Trim$(String$)="" then
01210           let String$=Cnvrt$("PIC(#####)",(Linecount:=Linecount+Increment)) & "  !"
01220        else
01230           let String$=Cnvrt$("PIC(#####)",(Linecount:=Linecount+Increment)) & " " & String$
01240        END IF  ! end if
01250     else
01260        let String$="      "&String$
01270        let Skipnextone=0
01280     END IF  ! end if
01290  PRINTLINE: if Trim$(String$)(Len(Trim$(String$))-1:Len(Trim$(String$))) = "!:" then let Skipnextone=1
01300     print #2: String$
01310     goto READLINE
01320  DONEREADING: close #2:
01330     close #1: