import { NextResponse } from "next/server";
import Groq from "groq-sdk";


const groq = new Groq({

  apiKey: process.env.GROQ_API_KEY,

});



export async function POST(req: Request) {


try {


const {
message,
answer
} = await req.json();




const completion =
await groq.chat.completions.create({


model:"llama-3.3-70b-versatile",



messages:[


{

role:"system",

content:`

You create short ChatGPT style conversation titles.

Rules:

- Maximum 5 words
- Clear and descriptive
- No quotes
- No emojis
- No punctuation
- Return ONLY the title


Examples:


User:
What are Rony's skills?


Title:
Rony skills overview



User:
Tell me about his projects


Title:
Rony projects



`

},



{

role:"user",

content:`

Question:

${message}



Answer:

${answer}


`

}



]

});





const title =
completion
.choices[0]
.message
.content
?.trim();





return NextResponse.json({

title:
title || "New conversation"

});





}

catch(error){


console.error(
"TITLE ERROR:",
error
);



return NextResponse.json(

{

error:"Failed generating title"

},

{

status:500

}

);


}


}