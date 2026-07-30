"use client";


import {
useState
} from "react";


interface Props{

onSend:(message:string)=>void;

loading:boolean;

}



export default function ChatInput({
onSend,
loading
}:Props){


const [text,setText]=useState("");



function send(){

if(!text.trim())
return;


onSend(text);

setText("");

}



return (

<div
className="
bg-zinc-950
border-t
border-zinc-800
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


<input

value={text}

onChange={
(e)=>setText(e.target.value)
}

onKeyDown={
(e)=>{
if(e.key==="Enter")
send();
}
}

placeholder="
Ask something about Rony...
"

className="
flex-1
rounded-xl
bg-zinc-900
border
border-zinc-700
px-4
py-3
text-white
outline-none
"

/>



<button

onClick={send}

disabled={loading}

className="
px-5
rounded-xl
bg-white
text-black
"

>

{
loading
?
"..."
:
"Send"
}


</button>


</div>


</div>

);


}