import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export async function POST(req: Request) {

try {


const {message}=await req.json();



const profilePath =
path.join(
process.cwd(),
"data",
"profile.txt"
);



const profile =
fs.readFileSync(
profilePath,
"utf8"
);



const completion =
await groq.chat.completions.create({

model:
"llama-3.3-70b-versatile",


stream:true,


messages:[

{

role:"system",

content:`

You are Ask Rony AI.

Answer only about Rony Ghanem.

Use only this profile:

${profile}


Rules:

- Answer in the same language as the user.
- Support all languages.
- Do not invent information.
- If information is missing say:

"I don't have information about that yet."


If the user only greets:

"Hello! Feel free to ask about Rony Ghanem."

`

},

{

role:"user",

content:message

}

]

});




const encoder =
new TextEncoder();



const stream =
new ReadableStream({

async start(controller){


for await(
const chunk of completion
){


const text =
chunk.choices[0]
.delta
.content;


if(text){

controller.enqueue(
encoder.encode(text)
);

}


}


controller.close();


}

});



return new Response(
stream,
{
headers:{
"Content-Type":
"text/plain; charset=utf-8"
}
}
);



}

catch(error){

console.error(
"Groq Error:",
error
);


return NextResponse.json(
{
error:"Something went wrong"
},
{
status:500
}
);


}

}