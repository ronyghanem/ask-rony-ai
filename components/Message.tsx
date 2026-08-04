"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface Props {

role:"user"|"assistant";

content:string;

timestamp:string;

onRegenerate:()=>void;

}



export default function Message({

role,

content,

timestamp,

onRegenerate

}:Props){



const isUser = role==="user";



return (

<div

className={`

flex

gap-3

my-6

${

isUser

?

"justify-end"

:

"justify-start"

}

`}

>





{/* Avatar */}

<div

className={`

w-9

h-9

rounded-full

flex

items-center

justify-center

text-white

flex-shrink-0


${

isUser

?

"bg-blue-600"

:

"bg-black dark:bg-white dark:text-black"

}

`}

>

{

isUser

?

"👤"

:

"🤖"

}

</div>







<div

className={`

max-w-3xl

rounded-2xl

px-5

py-4


${

isUser

?

"bg-blue-600 text-white"

:

"bg-white dark:bg-zinc-800 text-black dark:text-white"

}

`}

>





<div

className="

text-xs

opacity-60

mb-2

"

>

{

isUser

?

"You"

:

"Rony AI"

}

 • {timestamp}

</div>








<div

className="

prose

dark:prose-invert

max-w-none

text-sm

leading-7

"

>


<ReactMarkdown

remarkPlugins={[remarkGfm]}

>

{content}

</ReactMarkdown>



</div>








{

!isUser && (

<div

className="

flex

gap-4

mt-4

text-xs

text-zinc-500

"

>


<button

onClick={()=>navigator.clipboard.writeText(content)}

>

📋 Copy

</button>





<button

onClick={()=>{

const speech =
new SpeechSynthesisUtterance(content);

speech.lang =
localStorage.getItem("language")
||
"en-US";


window.speechSynthesis.speak(speech);


}}

>

🔊 Listen

</button>






<button

onClick={onRegenerate}

>

↻ Regenerate

</button>



</div>

)

}



</div>



</div>


);


}