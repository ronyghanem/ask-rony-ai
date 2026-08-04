"use client";

import { useEffect, useState } from "react";
import { getTranslation } from "@/src/i18n";


export default function Navbar(){


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


bg-white

dark:bg-zinc-950



border-b

border-zinc-200

dark:border-zinc-800



flex

items-center



px-6



text-black

dark:text-white



transition-colors

"

>





<h1

className="

font-semibold

"

>

{t.appName}

</h1>





</header>


);


}