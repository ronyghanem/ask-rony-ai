"use client";

import {
  useState,
  useRef,
  useEffect
} from "react";

import { getTranslation } from "@/src/i18n";


interface Props {

  onSend:(message:string)=>void;

  loading:boolean;

}



export default function ChatInput({

  onSend,

  loading

}:Props){


const [text,setText]=useState("");

const [listening,setListening]=useState(false);

const [t,setT]=useState<any>(null);


const recognitionRef =
useRef<any>(null);





useEffect(()=>{


function update(){

setT(getTranslation());

}


update();


window.addEventListener(
"languageChanged",
update
);


return ()=>{

window.removeEventListener(
"languageChanged",
update
);

};


},[]);






function send(){


const message=text.trim();


if(!message)
return;


onSend(message);


setText("");


}







function startVoice(){


if(listening){

recognitionRef.current?.stop();

setListening(false);

return;

}



const SpeechRecognition =

window.SpeechRecognition ||

(window as any).webkitSpeechRecognition;



if(!SpeechRecognition){

alert(
"Speech recognition is not supported"
);

return;

}




const recognition =
new SpeechRecognition();



recognition.lang =
localStorage.getItem("language")
||
"en-US";


recognition.continuous=false;

recognition.interimResults=true;



recognition.onstart=()=>{

setListening(true);

};



recognition.onend=()=>{

setListening(false);

};



recognition.onresult=(event:any)=>{


let transcript="";


for(
let i=event.resultIndex;
i<event.results.length;
i++
){

transcript +=
event.results[i][0].transcript;

}


setText(transcript);


};



recognitionRef.current =
recognition;


recognition.start();


}







if(!t)
return null;






return (

<div

className="
w-full
bg-white
dark:bg-zinc-950

border-t
border-zinc-200
dark:border-zinc-800

p-1
sm:p-3

"

>


<div

className="
w-full
max-w-4xl
mx-auto

flex
items-center

gap-0.5
sm:gap-2
overflow-hidden

"


>


{/* Voice Button */}

<button

type="button"

onClick={startVoice}

className={`
shrink-0

w-7
h-7

sm:w-11
sm:h-11

rounded-xl

flex
items-center
justify-center


text-[13px]
sm:text-lg

transition-all

duration-300


${
listening

?
"bg-red-500 text-white scale-110"

:

"bg-zinc-900 text-white hover:scale-105"

}

`}

>

🎤

</button>









{/* Input */}

<div

className="
flex-1
min-w-0
"

>


<input


value={text}


onChange={(e)=>
setText(e.target.value)
}


onKeyDown={(e)=>{

if(e.key==="Enter" && !loading){

send();

}

}}



placeholder={
t.placeholder ||
"Ask something about Rony..."
}



className="

w-full

h-8

sm:h-11


rounded-xl


bg-zinc-100

dark:bg-zinc-900


border

border-zinc-300

dark:border-zinc-700



px-2.5
sm:px-4


text-sm

sm:text-sm


text-black

dark:text-white



outline-none


focus:ring-2

focus:ring-blue-500


transition-all

"





/>


</div>









{/* Send Button */}

<button

type="button"

onClick={send}

disabled={loading}


className="

shrink-0
flex-none

h-8
sm:h-11

min-w-[28px]
sm:min-w-[88px]

w-8
sm:w-auto

px-0
sm:px-4


rounded-xl


bg-black

dark:bg-white


text-white

dark:text-black



text-sm


font-medium



flex
items-center
justify-center



transition-all

duration-300



hover:scale-105


active:scale-95



disabled:opacity-50


"

>


{

loading

?

"⏳"

:

(
<>
<span className="text-sm sm:text-base">➤</span>
<span className="hidden sm:inline whitespace-nowrap">
{t.send || "Send"}
</span>
</>
)


}


</button>





</div>


</div>

);


}