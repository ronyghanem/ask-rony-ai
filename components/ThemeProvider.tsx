"use client";

import { useEffect } from "react";


export default function ThemeProvider(){

useEffect(()=>{


const theme =
localStorage.getItem("theme");



if(theme==="dark"){

document.documentElement.classList.add("dark");

}

else if(theme==="light"){

document.documentElement.classList.remove("dark");

}

else {


const systemDark =
window.matchMedia(
"(prefers-color-scheme: dark)"
).matches;



if(systemDark){

document.documentElement.classList.add("dark");

}


}



},[]);



return null;

}