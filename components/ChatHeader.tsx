"use client";

import { useEffect, useState } from "react";
import Settings from "./Settings";
import { getTranslation } from "@/src/i18n";


export default function ChatHeader(){


const [t,setT]=useState<any>(null);

const [voiceEnabled,setVoiceEnabled]=useState(true);





useEffect(()=>{


function update(){

setT(getTranslation());


const saved =
localStorage.getItem("voice-enabled");


setVoiceEnabled(
saved !== "false"
);


}



update();



window.addEventListener(
"languageChanged",
update
);


window.addEventListener(
"voiceChanged",
update
);



return ()=>{


window.removeEventListener(
"languageChanged",
update
);


window.removeEventListener(
"voiceChanged",
update
);



};


},[]);







function toggleVoice(){


const newValue =
!voiceEnabled;



setVoiceEnabled(newValue);



localStorage.setItem(
"voice-enabled",
String(newValue)
);



window.dispatchEvent(
new Event("voiceChanged")
);




if(!newValue){

window.speechSynthesis.cancel();

}


}







if(!t)

return null;






return (

<div

className="

bg-white

dark:bg-zinc-950


border-b

border-zinc-200

dark:border-zinc-800


p-4


flex

items-center

justify-between


text-black

dark:text-white

"

>







<div>


<h2

className="font-semibold"

>

{t.appName}

</h2>



<p

className="text-xs text-zinc-400"

>

{t.subtitle}

</p>



</div>









<div

className="

flex

items-center

gap-4

"

>






<button

onClick={toggleVoice}

className="

text-xl

hover:scale-110

transition

"

title={
voiceEnabled
?
"Disable voice"
:
"Enable voice"
}

>

{

voiceEnabled

?

"🔊"

:

"🔇"

}


</button>








<Settings />






</div>







</div>


);


}