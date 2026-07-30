"use client";

import ReactMarkdown from "react-markdown";

interface Props{

  role:"user"|"assistant";

  content:string;

  timestamp:string;

}

export default function Message({

  role,

  content,

  timestamp

}:Props){

  const isUser =
    role==="user";

  return (

    <div
      className="
      mb-6
      "
    >

      <div
        className={`
        flex
        items-center
        gap-2
        mb-2

        ${
          isUser
          ? "justify-end"
          : "justify-start"
        }
        `}
      >

        <div
          className="
          w-8
          h-8
          rounded-full
          bg-zinc-700
          flex
          items-center
          justify-center
          text-sm
          "
        >

          {
            isUser
            ? "👤"
            : "🤖"
          }

        </div>


        <div
          className="
          text-xs
          text-zinc-400
          "
        >

          {
            isUser
            ? "You"
            : "Rony AI"
          }

          {" • "}

          {timestamp}

        </div>

      </div>


      <div
        className={`
        max-w-[80%]
        rounded-2xl
        px-4
        py-3

        ${
          isUser

          ? `
            ml-auto
            bg-blue-600
            text-white
          `

          : `
            bg-zinc-800
            text-white
          `
        }
        `}
      >

        {
          isUser

          ? content

          : (
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          )
        }

      </div>

    </div>

  );

}