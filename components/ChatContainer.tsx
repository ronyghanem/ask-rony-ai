"use client";

import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { getTranslation } from "@/src/i18n";


interface MessageType{

  role:"user"|"assistant";

  content:string;

  timestamp:string;

}


interface Props{

  messages:MessageType[];

  loading:boolean;

  onSuggestionClick:(text:string)=>void;

  onRegenerate:(index:number)=>void;

}



export default function ChatContainer({

  messages,

  loading,

  onSuggestionClick,

  onRegenerate

}:Props){


const bottomRef = useRef<HTMLDivElement>(null);


const [t,setT] = useState<any>(null);





// Load translation + listen for language changes

useEffect(()=>{


function updateLanguage(){

setT(getTranslation());

}


updateLanguage();



window.addEventListener(
"languageChanged",
updateLanguage
);



return ()=>{

window.removeEventListener(
"languageChanged",
updateLanguage
);

};


},[]);







// Auto scroll + voice

useEffect(()=>{


bottomRef.current?.scrollIntoView({

behavior:"smooth"

});



const lastMessage =
messages[messages.length-1];



if(

lastMessage &&

lastMessage.role==="assistant" &&

lastMessage.content

){



const voiceEnabled =
localStorage.getItem("voice-enabled");



if(voiceEnabled !== "false"){



speakText(
lastMessage.content
);


}



}



},[messages,loading]);







function speakText(text:string){



if(
typeof window==="undefined"
)
return;



const synth =
window.speechSynthesis;



synth.cancel();



const speech =
new SpeechSynthesisUtterance(text);



const language =
localStorage.getItem("language")
||
"en-US";



speech.lang = language;



const voices =
synth.getVoices();



// Find matching voice

const voice =
voices.find(v=>

v.lang
.toLowerCase()
.startsWith(
language.split("-")[0]
.toLowerCase()
)

);



if(voice){

speech.voice=voice;

}



speech.rate=1;

speech.pitch=1;



synth.speak(speech);


}







if(!t)

return null;







const suggestions=[

t.skills,

t.projects,

t.technologies,

t.career

].filter(Boolean);







return (

<div

className="
flex-1
overflow-y-auto
p-6
bg-zinc-100
dark:bg-zinc-900
transition-colors
"

>


<div

className="
max-w-4xl
mx-auto
"

>







{

messages.length===0 && (


<div

className="
min-h-full
flex
items-center
justify-center
text-center
text-zinc-600
dark:text-zinc-400
"

>


<div>



<h1

className="
text-3xl
font-semibold
text-black
dark:text-white
mb-3
"

>

{t.appName}

</h1>





<p className="mb-6">

{t.welcome}

</p>







<div

className="
grid
grid-cols-1
md:grid-cols-2
gap-3
max-w-xl
mx-auto
"

>


{

suggestions.map(

(question:string,index:number)=>(


<button


key={index}


onClick={()=>onSuggestionClick(question)}



className="
border
border-zinc-300
dark:border-zinc-700

bg-white
dark:bg-zinc-800

hover:bg-zinc-200
dark:hover:bg-zinc-700

text-black
dark:text-white

rounded-xl
px-4
py-3
text-sm
transition
"

>


{question}


</button>


)

)


}



</div>





</div>


</div>


)

}









{

messages.map((message,index)=>(


<Message

key={`${message.role}-${index}`}

role={message.role}

content={message.content}

timestamp={message.timestamp}

onRegenerate={()=>onRegenerate(index)}

/>


))

}









{

loading && (


<div

className="
flex
justify-start
my-4
"

>


<div

className="
bg-zinc-200
dark:bg-zinc-800
rounded-2xl
px-4
py-3
flex
gap-1
"

>


<span className="animate-bounce">
●
</span>


<span className="animate-bounce [animation-delay:150ms]">
●
</span>


<span className="animate-bounce [animation-delay:300ms]">
●
</span>


</div>


</div>


)

}







<div ref={bottomRef}/>



</div>


</div>


);


}