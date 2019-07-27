00010      dim String$*4000,String2$*4000 ! #Autonumber# 10,10
00020      dim Infile$*255
00030      dim Const$(1)*800
00040      dim Constname$(1)*30
00050      dim Currentselect$*400,Trimmedline$*4000
00060      dim Currentcase$(1)*400
00070      dim AfterString$*4000
00080      let Increment=1
00090      let Labelincrement=10
00100      mat Constname$(0)
00110      mat Const$(0)
00120      open #1: "name="&Infile$, display, input
00130      open #2: "name="&Outfile$&", recl=800, replace", display, output
00140   READLINE: linput #1: String$ eof DONEREADING
00150      do while (WrapPosition:=pos(String$,"!_"))
00160         linput #1: String2$ eof Ignore
00170         if file(1)=0 then
00180            let String$=rtrm$(String$(1:WrapPosition-1))&trim$(String2$)
00190         end if
00200      loop until file(1)
00210 !
00220 ! Check for a ` that is not inside "s .. so count from the beginning flagging if we're in "s
00230 !  if so, we're in special character processing mode. loop until the end of the string,
00240 !  which is a ` that is not immediately followed by another ` (we'll honor BR's normal stuff) ``
00250 !
00260 ! just like above, we put everything together on one line.
00270 !  Each new line should add a "&hex$("0D0A")&" and then the rest of the string.
00280 !   If a " is encountered, then turn it into a ""
00290 !   If a {Variable$} is encountered then turn it into "&Variable$&"
00300 !   If a {Variable} is encountered then turn it into "&str$(Variable)&"
00310 !
00320      let InQuotesSingle=0 : let InQuotesDouble=0 : let CheckPosition=0
00330      do while CheckPosition<=len(String$)
00340         let CheckPosition+=1
00350         if pos("""",String$(CheckPosition:CheckPosition)) and ~InQuotesSingle then let InQuotesDouble=~InQuotesDouble
00355         if pos("'",String$(CheckPosition:CheckPosition)) and ~InQuotesDouble then let InQuotesSingle=~InQuotesSingle
00360         if String$(CheckPosition:CheckPosition)="`" and ~InQuotesSingle and ~InQuotesDouble then
00370            ! Enable Special String Processing.
00380            ! Check from there to the end of the line.
00385            let String$(CheckPosition:CheckPosition)=""""
00390            let SpecialPosition=CheckPosition
00400            let SpecialStringProcessing=1
00410            do while SpecialStringProcessing
00420               let SpecialPosition+=1
00430               if SpecialPosition>len(String$) then
00440                  ! Read the next string and put it on here.
00450                  linput #1: String2$ eof Ignore
00460                  if file(1)=0 then
00470                     let String$=String$&"""&hex$(""0d0a"")&"""&trim$(String2$)
00475                     let SpecialPosition+=15
00480                  else
00490                     ! This is an error, the string isn't completed. Exit and let BR give the error.
00500                     let SpecialStringProcessing=0
00510                  end if
00520               else if String$(SpecialPosition:SpecialPosition)="`" then
00530                  ! If its followed by another one then
00540                  if len(String$)>=SpecialPosition+1 and String$(SpecialPosition+1:SpecialPosition+1)="`" then
00550                     ! Replace it with a single one.
00560                     let String$(SpecialPosition:SpecialPosition+1)="`"
00570                  else ! Otherwise
00580                     ! Replace it with a " and turn off SpecialStringProcessing.
00590                     let String$(SpecialPosition:SpecialPosition)=""""
00600                     let SpecialStringProcessing=0
00610                  end if
00620               else if String$(SpecialPosition:SpecialPosition+1)="{{" then
00630                  if (ReplacePosition:=pos(String$,"}}",SpecialPosition)) then
00640                     ! Replace everything from here to the }} with "&contents&".
00642                     if pos(String$(SpecialPosition:ReplacePosition),"$") then
00650                        let String$(ReplacePosition:ReplacePosition+1)="&"""
00660                        let String$(SpecialPosition:SpecialPosition+1)="""&"
00665                        let SpecialPosition=ReplacePosition+2
00670                     else
00672                        ! if there's no $ inside, then add a str$() around it.
00673                        let String$(ReplacePosition:ReplacePosition+1)=")&"""
00675                        let String$(SpecialPosition:SpecialPosition+1)="""&str$("
00677                        let SpecialPosition=ReplacePosition+8
00678                     end if
00679                  end if
00680               else if String$(SpecialPosition:SpecialPosition)="""" then
00690                  ! if its a single double quote, replace it with 2 double quotes.
00700                  let String$(SpecialPosition:SpecialPosition)=""""""
00705                  let SpecialPosition+=1
00710               end if
00720            loop
00725            let CheckPosition=SpecialPosition
00730         end if
00740      loop
00760      !
00770      ! While we're at it we should support multi-line comments using /* and */. Those will be easier.
00780      !
00790      ! At the position of the /* replace the /* with a !.
00800      ! At every line in between there, add a ! to the beginning.
00810      ! At the position of the */ Put all the stuff before it after it, and vice versa, and change it to a !
00820      !
00830      if MultilineComment then
00840         if (SpecialPosition:=pos(String$,"*/")) then
00850            let MultilineComment=0
00860            let String$=String$(SpecialPosition+2:len(String$))&" ! "&String$(1:SpecialPosition-1)
00870         else
00880            let String$(1:0)=" ! "
00890         end if
00900      else
00930         if (ReplacePosition:=pos(String$,"/*")) then
00940            let MultilineComment=1
00950            let String$(ReplacePosition:ReplacePosition+1)="!"
00960         end if
00970      end if
00980 !
02100      if not SkipNextOne and (ltrm$(String$)(1:1)="!" and pos(String$,"!")>3) then let String$(1:4)=" ! ."&ltrm$(string$(1:4))
02110      for Constindex=21 to Udim(Mat Const$)
02120         if (Constantposition:=Pos(Uprc$(String$),Uprc$(Constname$(Constindex)))) then
02130            let String$=String$(1:Constantposition-1) & Const$(Constindex) & String$(Constantposition+Len(Constname$(Constindex)):Len(String$))
02140         end if
10000      next Constindex
10010      if (Constantposition:=Pos(Uprc$(String$),"#DEFINE#")) then
10020         let Constantposition+=8
10030         if (Constnamestartpos:=Pos(String$,"[[",Constantposition)) then
11000            if (Constnameendpos:=Pos(String$,"]]",Constnamestartpos)) then
11010               let Constnameendpos+=1
11020               mat Const$(Constindex:=(Udim(Mat Const$)+1))
11030               mat Constname$(Constindex)
11040               let Constname$(Constindex)=String$(Constnamestartpos:Constnameendpos)
11050               let Const$(Constindex)=Trim$(String$(Constnameendpos+2:Len(String$)))
11060               if Const$(Constindex)(1:1)="=" then ! If Equals, Then Ignore It
11070                  let Const$(Constindex)=Trim$(Const$(Constindex)(2:Len(Const$(Constindex))))
11080               END IF  ! end if
11090               if Const$(Constindex)(1:1)='"' And Const$(Constindex)(Len(Const$(Constindex)):Len(Const$(Constindex)))='"' then
11100                  let Const$(Constindex)=Const$(Constindex)(2:Len(Const$(Constindex))-1) ! Remove Quotes If Both Are Present
11110               END IF  ! end if
11120            END IF  ! end if
11800         END IF  ! end if
11810      END IF  ! end if
11820      if (Selectposition:=Pos(Uprc$(String$),"#SELECT#")) then
11830         if (Caseposition:=Pos(Uprc$(String$),"#CASE#",Selectposition)) then
12000            let Currentselect$=String$(Selectposition+8:Caseposition-1)
12010            let Caseindex=0
12020            let Currentcasechunk=Caseposition+6
12030            do
12040               let Caseindex+=1
12050               mat Currentcase$(Caseindex)
12060               if (Nextcasechunk:=Pos(String$,"#",Currentcasechunk)) then
12070                  let Currentcase$(Caseindex)=String$(Currentcasechunk:Nextcasechunk-1)
12080                  let Currentcasechunk=Nextcasechunk+1
12090               else
12100                  let Currentcase$(Caseindex)=String$(Currentcasechunk:Len(String$))
12110               END IF
13000            loop While Nextcasechunk
13010            let Afterstring$=" THEN  ! " & String$(SelectPosition:Len(String$))
13020            let String$=String$(1:SelectPosition-1) & "IF "
13030            for Caseindex=1 to Udim(Mat Currentcase$)
13040               if Caseindex>1 then
13050                  let String$=String$ & " or "
13060               END IF  ! end if
13070               let String$=String$ & Trim$(Currentselect$) & " = " & Trim$(Currentcase$(Caseindex))
13080            next Caseindex
13090            let String$ = String$ & Afterstring$
13100         END IF
13110      else if (Caseposition:=Pos(Uprc$(String$),"#CASE#")) then
13120         if Len(Trim$(Currentselect$)) then
13130            let Caseindex=0
13140            let Currentcasechunk=Caseposition+6
13150            do
13160               let Caseindex+=1
13170               mat Currentcase$(Caseindex)
13180               if (Nextcasechunk:=Pos(String$,"#",Currentcasechunk)) then
13190                  let Currentcase$(Caseindex)=String$(Currentcasechunk:Nextcasechunk-1)
13200                  let Currentcasechunk=Nextcasechunk+1
13210               else
13220                  let Currentcase$(Caseindex)=String$(Currentcasechunk:Len(String$))
13230               END IF
13240            loop While Nextcasechunk
13250            let Afterstring$=" THEN  ! " & String$(Caseposition:Len(String$))
13260            let String$=String$(1:Caseposition-1) & "ELSE IF "
13270            for Caseindex=1 to Udim(Mat Currentcase$)
13280               if Caseindex>1 then
13290                  let String$=String$ & " or "
14000               END IF
14010               let String$=String$ & Trim$(Currentselect$) & " = " & Trim$(Currentcase$(Caseindex))
14020            next Caseindex
14030            let String$ = String$ & Afterstring$
14040         END IF
14050      else if (Caseposition:=Pos(Uprc$(String$),"#CASE ELSE#")) then
14060         if Len(Trim$(Currentselect$)) then
14070            let String$ = String$(1:Caseposition-1) & "ELSE " & String$(Caseposition+11:Len(String$)) & " ! " & String$(Caseposition:Len(String$))
14080         END IF
14090      else if (Endposition:=Pos(Uprc$(String$),"#END SELECT#")) then
14100         let String$ = String$(1:EndPosition-1) & "END IF" & String$(EndPosition+12:len(String$)) & "  ! " & String$(EndPosition:len(String$))
14110         let Currentselect$ = ""
14120      END IF
14130      if (Newnumber:=Pos(Uprc$(String$),"#AUTONUMBER#")) then
14140         let Temp=0
14150         let Temp=Val(String$(Newnumber+12:Newincrement:=Pos(String$,",",Newnumber+12))) conv BADAUTONUMBER
14160         if Temp=0 then goto BADAUTONUMBER
14170         let Newlinecount=Temp
14180         if Newlinecount<=Linecount then print "AUTONUMBER ERROR IN "&Str$(Lastlinecount)&" TO "&Str$(Newlinecount)&" AUTONUMBER SECTION" : close #1: : close #2: : execute ("*FREE "&Outfile$) : print Bell : pause : execute ("SYSTEM")
14190         let Lastlinecount=Linecount=Newlinecount
14200         let Increment=Val(String$(Newincrement+1:4000)) conv BADAUTONUMBER
14210         let Linecount-=Increment ! Decrement So Next Increment Is Correct
14220      END IF
14230      if (Ltrm$(Uprc$(String$))(1:1)="L") And (Newnumber:=Pos(Ltrm$(Uprc$(String$))(1:7),":")) then
14240         let Newlinecount=Val(Ltrm$(Uprc$(String$))(2:Newnumber-1)) conv BADAUTONUMBER
14250         if (Newlinecount>Linecount) then
14260            let Linecount=Newlinecount
14270            if Mod(Linecount,Labelincrement)=0 then let Increment=Labelincrement
14280            let Linecount-=Increment ! Decrement So Next Num Is Correct
14290         else
14300            let Increment=Max(Int(Increment/2),2) ! Cut Incr In Half To Catch Up
14310         END IF
14320      END IF
14330   BADAUTONUMBER: ! Ignore Line Number Information
14340      let X=0
14350      let X = Val(String$(1:5)) conv ADDLINENUMBER
14360      if X>0 then goto PRINTLINE
14370   ADDLINENUMBER: !
14380      if Not Skipnextone then
14390         if Trim$(String$)="" then
14400            let String$=Cnvrt$("PIC(#####)",(Linecount:=Linecount+Increment)) & "  !"
14410         else
14420            let String$=Cnvrt$("PIC(#####)",(Linecount:=Linecount+Increment)) & " " & String$
14430         END IF  ! end if
14440      else
14450         let String$="      "&String$
14460         let Skipnextone=0
14470      END IF  ! end if
14480   PRINTLINE: if Trim$(String$)(Len(Trim$(String$))-1:Len(Trim$(String$))) = "!:" then let Skipnextone=1
14490      print #2: String$
14500      goto READLINE
14510   DONEREADING: close #2:
16000      close #1:
