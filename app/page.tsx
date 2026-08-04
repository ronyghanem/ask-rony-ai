"use client";

import {
    useState,
    useEffect
} from "react";


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






useEffect(()=>{

localStorage.setItem(
"rony-chats",
JSON.stringify(chats)
);


},[chats]);





useEffect(()=>{


if(activeChat){

localStorage.setItem(
"active-chat",
activeChat
);

}


},[activeChat]);







function newChat(){


const id:string = crypto.randomUUID();



const chat:Chat = {

id,

title:"New conversation",

messages:[]

};



setChats(prev=>[

chat,

...prev

]);



setActiveChat(id);


}








async function generateChatTitle(
message:string,
answer:string,
chatId:string
){

try{


const res = await fetch(

"/api/title",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message,

answer

})

}

);




const data =
await res.json();



if(!data.title)
return;




setChats(prev=>

prev.map(chat=>{


if(chat.id !== chatId)

return chat;



return {

...chat,

title:data.title

};


})

);



}

catch(error){

console.error(
"TITLE ERROR:",
error
);

}


}









async function sendAIMessage(

message:string,

chatId:string,

makeTitle=true

){


setLoading(true);



try{


const language =

localStorage.getItem("language")

||

"en-US";





const res = await fetch(

"/api/chat",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:JSON.stringify({

message,

language

})

}

);





if(!res.body)

throw new Error(
"No response body"
);





const reader =
res.body.getReader();



const decoder =
new TextDecoder();



let answer="";





setChats(prev=>

prev.map(chat=>{


if(chat.id !== chatId)

return chat;



return {

...chat,

messages:[

...chat.messages,

{

role:"assistant",

content:"",

timestamp:

new Date()
.toLocaleTimeString()

}

]

};


})

);




while(true){


const {

done,

value

}=await reader.read();



if(done)

break;




answer += decoder.decode(

value,

{

stream:true

}

);




setChats(prev=>

prev.map(chat=>{


if(chat.id !== chatId)

return chat;



return {

...chat,


messages:

chat.messages.map((msg,index)=>{


if(

index === chat.messages.length - 1

&&

msg.role==="assistant"

){

return {

...msg,

content:answer

};

}



return msg;



})

};


})

);



}






if(makeTitle){

await generateChatTitle(

message,

answer,

chatId

);

}




}

catch(error){

console.error(
"AI ERROR:",
error
);


}

finally{

setLoading(false);

}


}
async function sendMessage(message:string){

if(!message.trim())
return;



let chatId:string;



if(activeChat !== null){

chatId = activeChat;

}

else{


const newId:string = crypto.randomUUID();


const newChat:Chat = {

id:newId,

title:"New conversation",

messages:[]

};



setChats(prev=>[
newChat,
...prev
]);



setActiveChat(newId);



chatId = newId;

}





setChats(prev=>

prev.map(chat=>{


if(chat.id !== chatId)

return chat;



return {

...chat,

messages:[

...chat.messages,

{

role:"user",

content:message,

timestamp:new Date()
.toLocaleTimeString()

}

]

};



})

);




await sendAIMessage(

message,

chatId

);



}









async function regenerateMessage(

index:number

){



const chat = chats.find(

c=>c.id===activeChat

);



if(!chat || !activeChat)

return;





const userMessage =

chat.messages[index-1];





if(

!userMessage ||

userMessage.role !== "user"

)

return;






// Remove old assistant message

setChats(prev=>

prev.map(c=>{


if(c.id !== activeChat)

return c;



return {

...c,

messages:c.messages.slice(

0,

index

)

};



})

);





await sendAIMessage(

userMessage.content,

activeChat,

false

);



}








function deleteChat(

id:string

){


setChats(prev=>

prev.filter(

chat=>chat.id !== id

)

);



if(activeChat===id){

setActiveChat(null);

localStorage.removeItem(
"active-chat"
);

}


}









const messages =

chats.find(

chat=>chat.id===activeChat

)

?.messages || [];









return (

<div

className="

flex

h-screen

bg-zinc-100

dark:bg-zinc-900

"

>



<Sidebar

chats={chats}

activeChat={activeChat}

onNewChat={newChat}

onSelectChat={setActiveChat}

onDeleteChat={deleteChat}

onRenameChat={()=>{}}

onPinChat={()=>{}}

onArchiveChat={()=>{}}

sidebarOpen={sidebarOpen}

setSidebarOpen={setSidebarOpen}

/>








<div

className="

flex-1

flex

flex-col

"

>


<Navbar/>

<ChatHeader/>






<ChatContainer

messages={messages}

loading={loading}

onSuggestionClick={sendMessage}

onRegenerate={regenerateMessage}

/>








<ChatInput

onSend={sendMessage}

loading={loading}

/>





</div>



</div>


);


}