import en from "./en";
import ar from "./ar";
import fr from "./fr";


const languages:any = {

  "en-US": en,

  "ar-LB": ar,

  "fr-FR": fr,

};




export function getTranslation(){


if(typeof window === "undefined"){

return en;

}



const language =

localStorage.getItem("language")

|| 

"en-US";



return languages[language] || en;


}