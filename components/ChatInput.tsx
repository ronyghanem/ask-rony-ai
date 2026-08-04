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

const translation = getTranslation();

console.log(
"Translation loaded:",
translation
);

setT(translation);

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


console.log(
"SEND CLICK"
);


console.log(
"TEXT:",
text
);



const message=text.trim();



if(!message){

console.log(
"EMPTY MESSAGE"
);

return;

}



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



recognition.onerror=(event:any)=>{

console.log(
"Speech error:",
event.error
);

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
bg-white
dark:bg-zinc-950

border-t
border-zinc-200
dark:border-zinc-800

p-4
"

>


<div

className="
max-w-4xl
mx-auto

flex
gap-3
"

>


<button

type="button"

onClick={startVoice}

className={`

px-4

rounded-xl

border

text-xl

transition


${
listening

?

"bg-red-500 text-white"

:

"bg-zinc-900 text-white"

}

`}

>

🎤

</button>





<input

value={text}

onChange={(e)=>
setText(e.target.value)
}


onKeyDown={(e)=>{

if(e.key==="Enter"){

send();

}

}}


placeholder={
t.placeholder ||
"Ask something about Rony..."
}


className="

flex-1

rounded-xl

bg-zinc-100

dark:bg-zinc-900


border

border-zinc-300

dark:border-zinc-700


px-4

py-3


text-black

dark:text-white


outline-none

"

/>






<button

type="button"

onClick={send}

className="

px-5

rounded-xl

bg-black

dark:bg-white


text-white

dark:text-black


disabled:opacity-50

"

disabled={loading}

>

{

loading

?

"..."

:

t.send || "Send"

}


</button>



</div>


</div>

);


}