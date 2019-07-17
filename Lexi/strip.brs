00010  ! #Autonumber# 10,10
00020  ! Program To Strip Line Numbers
00030     dim String$*4000
00035     dim Infile$*255
00040     dim Const$(1)*800
00050     dim Constname$(1)*30
00060     dim Currentselect$*400
00070     mat Constname$(0)
00080     mat Const$(0)
00090     open #1: "name="&Infile$&", recl=800", display, input
00100     open #2: "name="&Outfile$&", recl=800, replace", display, output
00110  READLINE: linput #1: String$ eof DONEREADING
00120     for Constindex=1 to Udim(Mat Const$)
00130        if (Constantposition:=Pos(Uprc$(String$),Uprc$(Const$(Constindex)))) then
00140           let String$=String$(1:Constantposition-1) & Constname$(Constindex) & String$(Constantposition+Len(Const$(Constindex)):Len(String$))
00150        end if
00160     next Constindex
00170     if (Constantposition:=Pos(Uprc$(String$),"#DEFINE#")) then
00180        let Constantposition+=8
00190        if (Constnamestartpos:=Pos(String$,"[[",Constantposition)) then
00200           if (Constnameendpos:=Pos(String$,"]]",Constnamestartpos)) then
00210              let Constnameendpos+=1
00220              mat Const$(Constindex:=(Udim(Mat Const$)+1))
00230              mat Constname$(Constindex)
00240              let Constname$(Constindex)=String$(Constnamestartpos:Constnameendpos)
00250              let Const$(Constindex)=Trim$(String$(Constnameendpos+2:Len(String$)))
00260              if Const$(Constindex)(1:1)="=" then ! If Equals, Then Ignore It
00270                 let Const$(Constindex)=Trim$(Const$(Constindex)(2:Len(Const$(Constindex))))
00280              end if
00290              if Const$(Constindex)(1:1)='"' And Const$(Constindex)(Len(Const$(Constindex)):Len(Const$(Constindex)))='"' then
00300                 let Const$(Constindex)=Const$(Constindex)(2:Len(Const$(Constindex))-1) ! Remove Quotes If Both Are Present
00310              end if
00320           end if
00330        end if
00340     end if
00350     if (Selectposition:=Pos(Uprc$(String$),"#SELECT#")) then
00360        if (Caseposition:=Pos(Uprc$(String$),"#CASE#",Selectposition)) then
00370           if (IfPosition:=Pos(Uprc$(String$),"IF ")) then
00380              let String$=String$(1:IfPosition-1) & String$(SelectPosition:len(String$))
00390              let CurrentlyInCaseStatement=1
00400           end if
00410        end if
00420     else if (Caseposition:=Pos(Uprc$(String$),"#CASE#")) then
00430        if CurrentlyInCaseStatement then
00440           let String$ = String$(1:pos(uprc$(string$),"ELSE IF")-1) & String$(CasePosition:len(String$))
00450        end if
00452     else if (Caseposition:=Pos(Uprc$(String$),"#CASE ELSE#")) then
00454        if CurrentlyInCaseStatement then
00456           let String$ = String$(1:pos(uprc$(string$),"ELSE ")-1) & String$(CasePosition:len(String$))
00458        end if
00460     else if (Endposition:=Pos(Uprc$(String$),"#END SELECT#")) then  !
00470        if CurrentlyInCaseStatement then
00480           let String$ = String$(1:pos(uprc$(String$),"END IF")-1) & String$(EndPosition:len(String$))
00490           let CurrentlyInCaseStatement=0
00500        end if
00510     end if
00515     if trim$(string$(1:5))="" then let String$=String$(6:4000) : goto NOLINENUMBER
00520     let X=Val(String$(1:5)) conv NOLINENUMBER
00530     if (X>0) And String$(6:6)=" " then let String$=String$(6:4000)
00540  NOLINENUMBER: ! A Line Has No Line Number At This Point
00550     print #2: String$
00560     goto READLINE
00570  DONEREADING: close #2:
00580     close #1:
