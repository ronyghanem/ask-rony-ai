"use client";

import { useState, useEffect } from "react";
import { Chat } from "@/types/chat";
import { getTranslation } from "@/src/i18n";


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

const [search,setSearch]=useState("");

const [t,setT]=useState<any>(null);





// update language instantly

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






const filteredChats =
chats.filter(chat=>

chat.title
.toLowerCase()
.includes(
search.toLowerCase()
)

);





if(!t)

return null;






return (

<>


{
sidebarOpen && (

<div

onClick={()=>setSidebarOpen(false)}

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


bg-white

dark:bg-zinc-950


border-r

border-zinc-200

dark:border-zinc-800


text-black

dark:text-white


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





<button

onClick={onNewChat}

className="

border

border-zinc-300

dark:border-zinc-700


rounded-lg

py-3


hover:bg-zinc-100

dark:hover:bg-zinc-800


transition

"

>

{t.newChat}

</button>







<input


value={search}


onChange={(e)=>
setSearch(e.target.value)
}


placeholder={t.search}


className="

mt-4

w-full

rounded-lg

px-3

py-2


bg-zinc-100

dark:bg-zinc-900


border

border-zinc-300

dark:border-zinc-700


outline-none


text-sm

"

/>







<div

className="

mt-4

flex-1

overflow-y-auto

"

>




<p

className="

text-xs

text-zinc-500

mb-3

"

>

{t.chats}

</p>








{

filteredChats.map(chat=>(


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


transition


${
activeChat===chat.id

?

"bg-zinc-200 dark:bg-zinc-800"

:

"hover:bg-zinc-100 dark:hover:bg-zinc-900"

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

onClick={()=>setOpenMenu(

openMenu===chat.id

?

null

:

chat.id

)}

className="

text-zinc-500

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


bg-white

dark:bg-zinc-800


border

border-zinc-200

dark:border-zinc-700


rounded-lg


shadow-xl


z-50


py-2

"

>



<button

className="menu-item"

onClick={()=>{

onRenameChat(chat.id);

setOpenMenu(null);

}}

>

{t.rename || "Rename"}

</button>





<button

className="menu-item"

onClick={()=>{

onPinChat(chat.id);

setOpenMenu(null);

}}

>

{t.pin || "Pin"}

</button>





<button

className="menu-item"

onClick={()=>{

onArchiveChat(chat.id);

setOpenMenu(null);

}}

>

{t.archive || "Archive"}

</button>







<button

className="

block

w-full

text-left

px-4

py-2

hover:bg-zinc-100

dark:hover:bg-zinc-700

text-sm

text-red-500

"

onClick={()=>{

onDeleteChat(chat.id);

setOpenMenu(null);

}}

>

{t.delete || "Delete"}

</button>



</div>

)

}





</div>


))

}







{

filteredChats.length===0 && (

<p

className="

text-sm

text-zinc-500

text-center

mt-4

"

>

{t.noChats}

</p>

)

}






</div>







<div

className="

text-sm

text-zinc-500

mt-4

"

>

© Rony Ghanem

</div>







</aside>


</>

);

}