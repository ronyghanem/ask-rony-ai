import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";



const geistSans = Geist({

variable:"--font-geist-sans",

subsets:["latin"],

});


const geistMono = Geist_Mono({

variable:"--font-geist-mono",

subsets:["latin"],

});




export const metadata: Metadata = {

title:"Ask Rony AI",

description:
"Personal AI assistant about Rony Ghanem",

keywords:[
"Rony Ghanem",
"Ask Rony AI",
"Portfolio",
"AI Assistant",
"Next.js",
"React"
],


authors:[
{
name:"Rony Ghanem"
}
],


};





export default function RootLayout({

children,

}:Readonly<{

children:React.ReactNode;

}>) {


return (

<html

lang="en"

suppressHydrationWarning

className={`

${geistSans.variable}

${geistMono.variable}

h-full

antialiased

`}

>


<body

className="

min-h-full

flex

flex-col


bg-white

text-black


dark:bg-zinc-950

dark:text-white


transition-colors

duration-300

"

>


<ThemeProvider />


{children}


</body>


</html>

);


}