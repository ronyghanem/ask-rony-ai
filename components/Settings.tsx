"use client";

import { useEffect, useState } from "react";
import { getTranslation } from "@/src/i18n";


export default function Settings(){


const [open,setOpen]=useState(false);

const [voiceEnabled,setVoiceEnabled]=useState(true);

const [language,setLanguage]=useState("en-US");

const [theme,setTheme]=useState("light");

const [t,setT]=useState<any>(null);





useEffect(()=>{


function update(){


setT(getTranslation());


setLanguage(
localStorage.getItem("language") || "en-US"
);


setTheme(
localStorage.getItem("theme") || "system"
);


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







useEffect(()=>{


const saved =
localStorage.getItem("voice-enabled");



if(saved !== null){

setVoiceEnabled(saved==="true");

}


},[]);









function toggleVoice(){


const value=!voiceEnabled;


setVoiceEnabled(value);


localStorage.setItem(
"voice-enabled",
String(value)
);



if(!value){

window.speechSynthesis.cancel();

}


}









function changeLanguage(value:string){


localStorage.setItem(
"language",
value
);


setLanguage(value);



window.dispatchEvent(
new Event("languageChanged")
);



}









function applyTheme(value:string){


if(value==="dark"){

document.documentElement.classList.add("dark");


}


else if(value==="light"){

document.documentElement.classList.remove("dark");


}


else{


const dark =
window.matchMedia(
"(prefers-color-scheme: dark)"
).matches;



if(dark){

document.documentElement.classList.add("dark");

}
else{

document.documentElement.classList.remove("dark");

}


}


}









function changeTheme(value:string){


setTheme(value);


localStorage.setItem(
"theme",
value
);


applyTheme(value);


}






if(!t)

return null;







return (

<div className="relative">


<button

onClick={()=>setOpen(!open)}

className="
text-zinc-500
dark:text-zinc-400
hover:text-black
dark:hover:text-white
text-xl
transition
"

>

⚙️

</button>







{

open && (

<div

className="
absolute
right-0
top-10
w-72
bg-white
dark:bg-zinc-900
border
border-zinc-200
dark:border-zinc-700
rounded-xl
shadow-xl
p-4
z-50
"

>





<h3

className="
text-black
dark:text-white
font-semibold
mb-4
"

>

{t.settings}

</h3>









<div

className="
flex
items-center
justify-between
mb-4
text-sm
text-black
dark:text-white
"

>


<span>

🔊 {t.voiceResponse}

</span>




<button

onClick={toggleVoice}

className={`

px-3
py-1
rounded-lg
text-xs
transition


${

voiceEnabled

?

"bg-green-600 text-white"

:

"bg-zinc-600 text-white"

}

`}

>

{

voiceEnabled

?

t.on || "ON"

:

t.off || "OFF"

}


</button>



</div>









<div className="mb-4">


<p className="
text-sm
text-black
dark:text-white
mb-2
">

🌐 {t.language}

</p>



<select

value={language}

onChange={(e)=>
changeLanguage(e.target.value)
}


className="
w-full
bg-zinc-100
dark:bg-zinc-800
text-black
dark:text-white
rounded-lg
p-2
outline-none
"

>


<option value="en-US">

{t.english}

</option>


<option value="ar-LB">

{t.arabic}

</option>


<option value="fr-FR">

{t.french}

</option>


</select>


</div>









<div>


<p className="
text-sm
text-black
dark:text-white
mb-2
">

🎨 {t.theme || "Theme"}

</p>




<select

value={theme}

onChange={(e)=>
changeTheme(e.target.value)
}


className="
w-full
bg-zinc-100
dark:bg-zinc-800
text-black
dark:text-white
rounded-lg
p-2
outline-none
"

>


<option value="light">

☀️ {t.light || "Light"}

</option>



<option value="dark">

🌙 {t.dark || "Dark"}

</option>



<option value="system">

💻 {t.system || "System"}

</option>



</select>


</div>






</div>


)

}



</div>


);


}