"use client";

import { useState } from "react";
import { Chat } from "@/types/chat";


interface Props {

  chats: Chat[];

  activeChat: string | null;

  onNewChat: () => void;

  onSelectChat: (id:string)=>void;

  onDeleteChat:(id:string)=>void;

  onRenameChat:(id:string)=>void;

  onPinChat:(id:string)=>void;

  onArchiveChat:(id:string)=>void;


  sidebarOpen:boolean;

  setSidebarOpen:(value:boolean)=>void;

}



export default function Sidebar({

  chats,

  activeChat,

  onNewChat,

  onSelectChat,

  onDeleteChat,

  onRenameChat,

  onPinChat,

  onArchiveChat,

  sidebarOpen,

  setSidebarOpen

}:Props){


const [openMenu,setOpenMenu]=useState<string|null>(null);



return (

<>


{
sidebarOpen && (

<div

onClick={()=>
setSidebarOpen(false)
}

className="
fixed
inset-0
bg-black/50
z-40
md:hidden
"

/>

)

}



<aside

className={`

fixed

md:relative

z-50


w-64

h-screen


bg-zinc-950

border-r

border-zinc-800


text-white

p-4


flex

flex-col


transition-transform

duration-300



${
sidebarOpen

?

"translate-x-0"

:

"-translate-x-full md:translate-x-0"

}

`}

>


<div

className="
flex
items-center
justify-between
mb-4
"

>

<button

onClick={onNewChat}

className="
border
border-zinc-700
rounded-lg
py-3
w-full
hover:bg-zinc-800
"

>

+ New Chat

</button>



<button

onClick={()=>
setSidebarOpen(false)
}

className="
md:hidden
ml-2
text-zinc-400
text-xl
"

>

✕

</button>


</div>





<div className="
mt-4
flex-1
overflow-y-auto
">


<p className="
text-xs
text-zinc-500
mb-3
">

Chats

</p>




{
chats.map(chat=>(


<div

key={chat.id}

className={`

relative

group

flex

items-center

justify-between

rounded-lg

px-3

py-2

mb-2

cursor-pointer



${
activeChat===chat.id

?

"bg-zinc-800"

:

"hover:bg-zinc-900"

}

`}

>


<div

onClick={()=>{

onSelectChat(chat.id);

setSidebarOpen(false);

}}

className="
truncate
text-sm
flex-1
"

>

{chat.title}

</div>




<button

onClick={()=>


setOpenMenu(

openMenu===chat.id

?

null

:

chat.id

)

}

className="
text-zinc-400
opacity-0
group-hover:opacity-100
px-2
"

>

⋯

</button>





{
openMenu===chat.id && (

<div

className="
absolute
right-2
top-10
w-40
bg-zinc-800
border
border-zinc-700
rounded-lg
shadow-xl
z-50
py-2
"

>



<button

className="
block
w-full
text-left
px-4
py-2
hover:bg-zinc-700
text-sm
"

onClick={()=>{

alert("Share coming soon");

setOpenMenu(null);

}}

>

Share

</button>




<button

className="
block
w-full
text-left
px-4
py-2
hover:bg-zinc-700
text-sm
"

onClick={()=>{

onRenameChat(chat.id);

setOpenMenu(null);

}}

>

Rename

</button>




<button

className="
block
w-full
text-left
px-4
py-2
hover:bg-zinc-700
text-sm
"

onClick={()=>{

onPinChat(chat.id);

setOpenMenu(null);

}}

>

Pin chat

</button>




<button

className="
block
w-full
text-left
px-4
py-2
hover:bg-zinc-700
text-sm
"

onClick={()=>{

onArchiveChat(chat.id);

setOpenMenu(null);

}}

>

Archive

</button>




<button

className="
block
w-full
text-left
px-4
py-2
hover:bg-zinc-700
text-sm
text-red-400
"

onClick={()=>{

onDeleteChat(chat.id);

setOpenMenu(null);

}}

>

Delete

</button>



</div>

)

}



</div>


))

}



</div>




<div className="
text-sm
text-zinc-500
mt-4
">

© Rony Ghanem

</div>



</aside>


</>

);

}