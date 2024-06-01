"use client";
import React, { useRef } from "react";
import { useState } from "react";
import ChatView from "./components/chat-view";
import Image from "next/image";
import { GENERATE_MESSAGE_ENDPOINT } from "@/constants/config";

export default function Home() {
  const [openAiMessages, setOpenAiMessages] = useState<string[]>([]);
  const [geminiMessages, setGeminiMessages] = useState<string[]>([]);
  const [anthropicMessages, setAnthropicMessages] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const selectedOpenAiModelRef = useRef<HTMLInputElement>(null);
  const selectedGeminiModelRef = useRef<HTMLInputElement>(null);
  const selectedAnthropicModelRef = useRef<HTMLInputElement>(null);

  let llmsProcessing = 0;

  async function chatApiRequest() {
    llmsProcessing++;

    const query = inputRef.current?.value;
    const selectedModel = selectedOpenAiModelRef.current?.value;
    const userMessage = { role: "user", content: query };
    const provider = "openai";
    const response = await fetch(`/api/${provider}/${GENERATE_MESSAGE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [...openAiMessages],
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
    const selectedModel = selectedGeminiModelRef.current?.value;
    const userMessage = { role: "user", content: query };
    const provider = "gemini";
    const response = await fetch(`/api/${provider}/${GENERATE_MESSAGE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...geminiMessages],
        query: userMessage.content,
        model: selectedModel,
      }),
    });
    const data = await response.json();
    llmsProcessing--;
    if (llmsProcessing == 0) {
      setIsWaiting(false);
    }
    setGeminiMessages((prev) => [...prev, userMessage, data]);
  }
  async function anthropicApiRequest() {
    llmsProcessing++;
    const query = inputRef.current?.value;
    const selectedModel = selectedAnthropicModelRef.current?.value;
    const userMessage = { role: "user", content: query };
    const provider = "anthropic";
    const response = await fetch(`/api/${provider}/${GENERATE_MESSAGE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...anthropicMessages],
        query: userMessage.content,
        model: selectedModel,
      }),
    });
    const data = await response.json();
    llmsProcessing--;
    if (llmsProcessing == 0) {
      setIsWaiting(false);
    }

    if (data.error) {
      alert(data.error.message);
      return;
    }
    setAnthropicMessages((prev) => [...prev, userMessage, data]);
  }

  function handleErrorResponse(error: any) {
    console.error(error);
    alert("An error occurred. Please try again.");
    setIsWaiting(false);
  }

  async function performLlmQuery() {
    setIsWaiting(true);
    chatApiRequest().catch(handleErrorResponse);
    geminiApiRequest().catch(handleErrorResponse);
    anthropicApiRequest().catch(handleErrorResponse);
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
        <ChatView modelRef={selectedOpenAiModelRef} messages={openAiMessages} provider={"openai"} ref={ref} />
        <ChatView modelRef={selectedGeminiModelRef} messages={geminiMessages} provider={"gemini"} ref={ref} />
        <ChatView modelRef={selectedAnthropicModelRef} messages={anthropicMessages} provider={"anthropic"} ref={ref} />
      </div>
    </main>
  );
}
