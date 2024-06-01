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

  async function chatApiRequest() {
    const query = inputRef.current?.value;
    const response = await fetch("/api/openai/generate-message", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...openAiMessages, { role: "user", content: query }],
      }),
    });
    setOpenAiMessages([...openAiMessages, query]);
    const data = await response.json();
    ref && ref.current && (ref.current.innerText = data.content);
  }

  async function geminiApiRequest() {
    const query = inputRef.current?.value;
    const response = await fetch("/api/gemini/generate-message", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...geminiMessages, { role: "user", content: query }],
        query: query,
        model: "gemini-1.5-pro",
      }),
    });
    const data = await response.json();
    setGeminiMessages([...geminiMessages, query, data.content]);
    // ref && ref.current && (ref.current.innerText = data.content);
  }

  async function performLlmQuery() {
    setIsWaiting(true);
    // await chatApiRequest();
    await geminiApiRequest().catch((error) => alert(error));
    setIsWaiting(false);
  }

  return (
    <main className="flex min-h-screen flex-col h-[100vh]">
      <div className="w-full h-20 flex lg:fixed">
        <div className="flex items-center px-4 gap-4 absolute h-full">
          <Image src="/logo.png" alt="logo" width={130} height={130} />
          <p className="w-24 text-xs">let&apos;s actually compare these models 🤨</p>
        </div>
        <div className="w-full flex items-center justify-center">
          <input disabled={isWaiting} ref={inputRef} className="w-[20rem] sm:w-[30rem] h-10 rounded-full px-4 text-black" type="text" placeholder="Query" />
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
