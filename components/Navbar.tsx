"use client";

import { useEffect, useState } from "react";
import { getTranslation } from "@/src/i18n";



interface NavbarProps {

  onMenuClick?:()=>void;

}



export default function Navbar({
  onMenuClick
}:NavbarProps){


const [t,setT]=useState<any>(null);



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





if(!t)

return null;





return (

<header

className="

h-14

w-full


bg-white

dark:bg-zinc-950



border-b

border-zinc-200

dark:border-zinc-800



flex

items-center



px-4

md:px-6



text-black

dark:text-white



transition-colors



"

>





{/* Mobile Menu Button */}

<button

onClick={onMenuClick}

className="

md:hidden

mr-3

p-2

rounded-lg

hover:bg-zinc-100

dark:hover:bg-zinc-800

transition

"

>

<svg

xmlns="http://www.w3.org/2000/svg"

fill="none"

viewBox="0 0 24 24"

strokeWidth={2}

stroke="currentColor"

className="w-6 h-6"

>

<path

strokeLinecap="round"

strokeLinejoin="round"

d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"

/>

</svg>


</button>









{/* Logo / Title */}

<div

className="

flex

items-center

gap-3

"

>


<div

className="

w-8

h-8

rounded-full

bg-gradient-to-br

from-blue-500

to-purple-600

flex

items-center

justify-center

text-white

font-bold

text-sm

"

>

R

</div>





<h1

className="

font-semibold

text-base

md:text-lg

truncate

"

>

{t.appName}

</h1>



</div>









{/* Right Side */}

<div

className="

ml-auto

flex

items-center

gap-2

"

>


<span

className="

hidden

sm:block

text-xs

text-zinc-500

dark:text-zinc-400

"

>

AI Assistant

</span>



<div

className="

w-2

h-2

rounded-full

bg-green-500

"

></div>


</div>







</header>


);


}