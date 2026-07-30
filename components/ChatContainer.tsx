"use client";

import { useEffect, useRef } from "react";
import Message from "./Message";


interface MessageType {

  role:"user" | "assistant";

  content:string;

}


interface Props {

  messages:MessageType[];

  loading:boolean;

  onSuggestionClick:(message:string)=>void;

}



export default function ChatContainer({

  messages,

  loading,

  onSuggestionClick

}:Props) {


const bottomRef = useRef<HTMLDivElement>(null);



useEffect(()=>{

bottomRef.current?.scrollIntoView({
behavior:"smooth"
});


},[messages,loading]);



return (

<div
className="
flex-1
overflow-y-auto
p-6
bg-zinc-900
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
text-zinc-400
"
>

<div>


<h1
className="
text-3xl
font-semibold
text-white
mb-3
"
>
Ask Rony AI
</h1>


<p className="mb-6">
Ask anything about Rony Ghanem
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

[
"What are Rony's skills?",
"Tell me about Rony's projects",
"What technologies does Rony use?",
"What is Rony's career goal?"
]

.map(question=>(

<button

key={question}

onClick={()=>onSuggestionClick(question)}

className="
border
border-zinc-700
bg-zinc-800
hover:bg-zinc-700
text-white
rounded-xl
px-4
py-3
text-sm
transition
"

>

{question}

</button>

))

}


</div>


</div>


</div>

)

}



{
messages.map(

(message,index)=>(

<Message

key={index}

role={message.role}

content={message.content}

timestamp={message.timestamp}

/>

)

)

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
bg-zinc-800
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