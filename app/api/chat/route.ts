import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";


const groq = new Groq({

  apiKey: process.env.GROQ_API_KEY,

});





function getLanguage(language:string){


switch(language){

case "ar-LB":
return "Arabic";


case "fr-FR":
return "French";


default:
return "English";


}


}






function loadKnowledge(){


const dataPath = path.join(

process.cwd(),

"data"

);



if(!fs.existsSync(dataPath)){

return "";

}



const files = fs.readdirSync(dataPath)

.filter(file=>

file.endsWith(".txt")

);



let knowledge = "";



for(const file of files){


const content = fs.readFileSync(

path.join(dataPath,file),

"utf8"

);



knowledge += `


### ${file}


${content}


`;

}



return knowledge;


}








export async function POST(req:Request){


try{



const {

message,

language="en-US"

}=await req.json();





console.log(

"USER MESSAGE:",

message

);



console.log(

"LANGUAGE:",

language

);






const knowledge = loadKnowledge();



const selectedLanguage =
getLanguage(language);






const completion = await groq.chat.completions.create({



model:"llama-3.3-70b-versatile",


stream:true,


temperature:0.4,


max_tokens:1000,



messages:[


{

role:"system",


content:`


You are "Ask Rony AI".

You are a personal AI assistant about Rony Ghanem.



Your job:

Answer questions ONLY about Rony Ghanem.

Use ONLY the provided knowledge.



====================

KNOWLEDGE

====================


${knowledge}



====================

LANGUAGE

====================


Always answer in ${selectedLanguage}.



====================

STYLE RULES

====================


Your answers must look like ChatGPT.


Use Markdown formatting:



- Use **bold** for important words.

- Use headings when useful.

- Use bullet points for lists.

- Use short paragraphs.

- Never create one giant paragraph.



Example:



### Skills

**Frontend**

- React
- Next.js
- Tailwind CSS



**Backend**

- Node.js
- MongoDB





====================

IMPORTANT RULES

====================


1. Never invent information.

2. If information does not exist say:

"I don't have information about that yet."

3. Do not answer questions unrelated to Rony.

4. If user greets you:

Reply politely:

"Hello! Feel free to ask me anything about Rony Ghanem."

5. Keep answers professional and concise.



`


},



{


role:"user",


content:message


}



]



});







const encoder = new TextEncoder();




const stream = new ReadableStream({


async start(controller){



try{



for await(const chunk of completion){



const text =

chunk.choices[0]?.delta?.content;



if(text){


controller.enqueue(

encoder.encode(text)

);


}


}



}

catch(error){


console.error(
"STREAM ERROR:",
error
);


}



finally{


controller.close();


}



}


});






return new Response(

stream,

{

headers:{


"Content-Type":

"text/plain; charset=utf-8",



"Cache-Control":

"no-cache",



"Connection":

"keep-alive"


}

}

);



}

catch(error){


console.error(

"API ERROR:",

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