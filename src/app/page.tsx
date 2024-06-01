"use client";
import React, { useRef } from "react";
import { useState } from "react";
import ChatView from "./components/chat-view";
import Image from "next/image";

export default function Home() {
  const [openAiMessages, setOpenAiMessages] = useState<string[]>([]);
  const [geminiMessages, setGeminiMessages] = useState<string[]>([]);
  const [anthropicMessages, setAnthropicMessages] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  let llmsProcessing = 0;

  async function chatApiRequest() {
    llmsProcessing++;

    const query = inputRef.current?.value;
    const userMessage = { role: "user", content: query };
    const response = await fetch("/api/openai/generate-message", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...openAiMessages, userMessage],
      }),
    });
    const data = await response.json();
    llmsProcessing--;

    if (llmsProcessing == 0) {
      setIsWaiting(false);
    }

    setOpenAiMessages((prev) => [...prev, userMessage, data]);
  }

  async function geminiApiRequest() {
    llmsProcessing++;
    const query = inputRef.current?.value;
    const userMessage = { role: "user", content: query };
    const response = await fetch("/api/gemini/generate-message", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...geminiMessages],
        query: userMessage.content,
        model: "gemini-1.5-pro",
      }),
    });
    const data = await response.json();
    llmsProcessing--;
    if (llmsProcessing == 0) {
      setIsWaiting(false);
    }
    setGeminiMessages((prev) => [...prev, userMessage, data]);
  }

  async function performLlmQuery() {
    setIsWaiting(true);
    chatApiRequest().catch((error) => alert(error));
    geminiApiRequest().catch((error) => alert(error));
  }

  return (
    <main className="flex min-h-screen flex-col h-[100vh]">
      <div className="w-full h-20 flex lg:fixed">
        <div className="flex items-center px-4 gap-4 absolute h-full">
          <Image src="/logo.png" alt="logo" width={130} height={130} />
          <p className="w-24 text-xs">let&apos;s actually compare these models 🤨</p>
        </div>
        <div className="w-full flex items-center justify-center">
          <input
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                performLlmQuery();
              }
            }}
            disabled={isWaiting}
            ref={inputRef}
            className="w-[20rem] sm:w-[30rem] h-10 rounded-full px-4 text-black"
            type="text"
            placeholder="Query"
          />
          {isWaiting ? (
            <p className="h-18 w-18  text-3xl animate-spin">⏳</p>
          ) : (
            <button className="h-18 w-18 rounded-full  text-white text-3xl" onClick={performLlmQuery}>
              🔍
            </button>
          )}
        </div>
      </div>
      <div className=" bg-[#161616] h-fit mx-2 xl:mx-16 rounded-t-[3rem] xl:mt-20 grid grid-cols-1 lg:grid-cols-2">
        <ChatView messages={openAiMessages} provider={"openai"} ref={ref} />
        <ChatView messages={geminiMessages} provider={"gemini"} ref={ref} />
        <ChatView messages={anthropicMessages} provider={"anthropic"} ref={ref} />
      </div>
    </main>
  );
}
