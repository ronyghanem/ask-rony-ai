import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Ordered list of models to try.
// If one is unavailable or hits a rate limit,
// the next model will be tried.
const MODEL_CHAIN = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
];

function getLanguage(language: string) {
  switch (language) {
    case "ar-LB":
      return "Arabic";

    case "fr-FR":
      return "French";

    default:
      return "English";
  }
}

function loadKnowledge() {
  const dataPath = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataPath)) {
    return "";
  }

  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".txt"));

  let knowledge = "";

  for (const file of files) {
    const content = fs.readFileSync(
      path.join(dataPath, file),
      "utf8"
    );

    knowledge += `

### ${file}

${content}

`;
  }

  return knowledge;
}

function isRetryableModelError(error: any) {
  return (
    error?.status === 429 ||
    error?.status === 404 ||
    error?.error?.error?.code === "rate_limit_exceeded" ||
    error?.error?.error?.code === "model_not_found"
  );
}

async function createCompletionWithFallback(
  messages: any[]
) {
  let lastError: any = null;

  for (const model of MODEL_CHAIN) {
    try {
      console.log("TRYING MODEL:", model);

      const completion =
        await groq.chat.completions.create({
          model,
          stream: true,
          temperature: 0.4,
          max_tokens: 1000,
          messages,
        });

      return {
        completion,
        modelUsed: model,
      };
    } catch (error: any) {
      lastError = error;

      console.error(
        `MODEL ERROR on ${model}:`,
        error
      );

      if (isRetryableModelError(error)) {
        console.warn(
          `Trying next fallback model after ${model}...`
        );

        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    const {
      message,
      language = "en-US",
    } = await req.json();

    console.log("USER MESSAGE:", message);
    console.log("LANGUAGE:", language);

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    const knowledge = loadKnowledge();

    const selectedLanguage =
      getLanguage(language);

    const messages = [
      {
        role: "system",

        content: `

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

- Use **bold** for important information.
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

2. If information does not exist, say:

"I don't have information about that yet."

3. Do not answer questions unrelated to Rony.

4. If the user greets you, reply:

"Hello! Feel free to ask me anything about Rony Ghanem."

5. Keep answers professional and concise.

`,
      },

      {
        role: "user",
        content: message,
      },
    ];

    const {
      completion,
      modelUsed,
    } = await createCompletionWithFallback(
      messages
    );

    console.log("MODEL USED:", modelUsed);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text =
              chunk.choices[0]?.delta?.content;

            if (text) {
              controller.enqueue(
                encoder.encode(text)
              );
            }
          }
        } catch (error) {
          console.error(
            "STREAM ERROR:",
            error
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "no-cache",

        "Connection":
          "keep-alive",

        "X-Model-Used":
          modelUsed,
      },
    });
  } catch (error: any) {
    console.error(
      "API ERROR:",
      error
    );

    if (
      error?.status === 429 ||
      error?.error?.error?.code ===
        "rate_limit_exceeded"
    ) {
      return NextResponse.json(
        {
          error:
            "Rony is getting a lot of questions right now. Please try again in a few minutes.",
        },
        {
          status: 429,
        }
      );
    }

    if (
      error?.status === 404 ||
      error?.error?.error?.code ===
        "model_not_found"
    ) {
      return NextResponse.json(
        {
          error:
            "The configured AI models are currently unavailable.",
        },
        {
          status: 503,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}