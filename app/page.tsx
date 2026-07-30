"use client";

import { useState, useEffect } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";

import { Chat } from "@/types/chat";


export default function Home(){


const [chats,setChats]=useState<Chat[]>([]);

const [activeChat,setActiveChat]=useState<string|null>(null);

const [loading,setLoading]=useState(false);

const [sidebarOpen,setSidebarOpen]=useState(false);



// Load chats

useEffect(()=>{


const savedChats =
localStorage.getItem("rony-chats");


const savedActive =
localStorage.getItem("active-chat");



if(savedChats){

setChats(
JSON.parse(savedChats)
);

}



if(savedActive){

setActiveChat(savedActive);

}


},[]);




// Save chats

useEffect(()=>{


localStorage.setItem(

"rony-chats",

JSON.stringify(chats)

);


},[chats]);




// Save active chat

useEffect(()=>{


if(activeChat){

localStorage.setItem(

"active-chat",

activeChat

);

}


},[activeChat]);





function newChat(){


const id =
crypto.randomUUID();


setChats(prev=>[

{

id,

title:"New conversation",

messages:[]

},

...prev

]);


setActiveChat(id);


}







async function sendMessage(message:string){


let chatId =
activeChat;



if(!chatId){


chatId =
crypto.randomUUID();


setChats(prev=>[

{

id:chatId!,

title:message.slice(0,30),

messages:[]

},

...prev

]);


setActiveChat(chatId);


}




setChats(prev=>

prev.map(chat=>

chat.id===chatId

?

{

...chat,


title:
chat.title==="New conversation"

?

message.slice(0,30)

:

chat.title,


messages:[

...chat.messages,


{

role:"user",

content:message,

timestamp:new Date().toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})

}

]


}

:

chat


)

);





setLoading(true);



try{


const res =
await fetch(

"/api/chat",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message

})

}

);



const reader =
res.body?.getReader();



if(!reader){

throw new Error("No stream");

}



const decoder =
new TextDecoder();



let assistantMessage="";





setChats(prev=>

prev.map(chat=>

chat.id===chatId

?

{

...chat,


messages:[

...chat.messages,


{

role:"assistant",

content:"",

timestamp:new Date().toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})

}


]


}

:

chat


)

);







while(true){



const {

done,

value

}=await reader.read();



if(done) break;



const chunk =
decoder.decode(value);



assistantMessage += chunk;





setChats(prev=>

prev.map(chat=>

chat.id===chatId

?

{

...chat,


messages:

chat.messages.map((msg,index)=>

index===chat.messages.length-1

?

{

...msg,

content:assistantMessage

}

:

msg


)


}

:

chat


)

);



}



}

catch(error){


console.error(error);



}

finally{


setLoading(false);


}


}








function deleteChat(id:string){


setChats(prev=>

prev.filter(chat=>

chat.id!==id

)

);



if(activeChat===id){

setActiveChat(null);

}


}





function renameChat(id:string){


const name =
prompt("New chat name");


if(!name)return;



setChats(prev=>

prev.map(chat=>

chat.id===id

?

{

...chat,

title:name

}

:

chat


)

);


}





function pinChat(id:string){


setChats(prev=>{


const chat =
prev.find(c=>c.id===id);



if(!chat)return prev;



return [

{

...chat,

title:"📌 "+chat.title

},

...prev.filter(c=>c.id!==id)

];


});


}






function archiveChat(id:string){


setChats(prev=>

prev.filter(chat=>

chat.id!==id

)

);


}





const currentMessages =

chats.find(

chat=>

chat.id===activeChat

)?.messages || [];






return (

<div className="
flex
h-screen
bg-zinc-900
">



<Sidebar


chats={chats}

activeChat={activeChat}

onNewChat={newChat}

onSelectChat={setActiveChat}

onDeleteChat={deleteChat}

onRenameChat={renameChat}

onPinChat={pinChat}

onArchiveChat={archiveChat}

sidebarOpen={sidebarOpen}

setSidebarOpen={setSidebarOpen}


/>





<div className="
flex-1
flex
flex-col
">





<div className="
md:hidden
flex
items-center
justify-between
p-4
bg-zinc-950
border-b
border-zinc-800
">

<button

onClick={()=>setSidebarOpen(true)}

className="
text-white
text-2xl
"

>

☰

</button>


<h1 className="
text-white
font-semibold
">

Ask Rony AI

</h1>


</div>





<Navbar/>


<ChatHeader/>





<ChatContainer

messages={currentMessages}

loading={loading}

onSuggestionClick={sendMessage}

/>





<ChatInput

onSend={sendMessage}

loading={loading}

/>



</div>


</div>


);


}