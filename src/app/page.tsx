"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import ChatView from "./components/chat-view";
import { GENERATE_MESSAGE_ENDPOINT } from "@/constants/config";
import AddChatView from "./components/add-chat-view";
import AppBar from "./components/app-bar";
import Settings from "./components/settings/settings";

export default function Home() {
  const [openAiMessages, setOpenAiMessages] = useState<string[]>([]);
  const [geminiMessages, setGeminiMessages] = useState<string[]>([]);
  const [anthropicMessages, setAnthropicMessages] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const selectedOpenAiModelRef = useRef<HTMLInputElement>(null);
  const selectedGeminiModelRef = useRef<HTMLInputElement>(null);
  const selectedAnthropicModelRef = useRef<HTMLInputElement>(null);

  const [openAiApiKey, setOpenAiApiKey] = useState<string>("");
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [anthropicApiKey, setAnthropicApiKey] = useState<string>("");

  let llmsProcessing = 0;

  function finishProcessing() {
    llmsProcessing--;

    if (llmsProcessing == 0) {
      setIsWaiting(false);
      if (inputRef.current) inputRef.current.value = "";
      inputRef.current?.focus();
    }
  }

  async function openAiApiRequest() {
    llmsProcessing++;

    const query = inputRef.current?.value;
    const selectedModel = selectedOpenAiModelRef.current?.value;
    const userMessage = { role: "user", content: query };
    const provider = "openai";
    const response = await fetch(`/api/${provider}/${GENERATE_MESSAGE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "x-api-key": openAiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [...openAiMessages],
        query: userMessage.content,
      }),
    });
    const data = await response.json();
    finishProcessing();

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
        "x-api-key": geminiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...geminiMessages],
        query: userMessage.content,
        model: selectedModel,
      }),
    });
    const data = await response.json();
    finishProcessing();
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
        "x-api-key": anthropicApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...anthropicMessages],
        query: userMessage.content,
        model: selectedModel,
      }),
    });
    const data = await response.json();
    finishProcessing();

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
    openAiApiRequest().catch(handleErrorResponse);
    geminiApiRequest().catch(handleErrorResponse);
    anthropicApiRequest().catch(handleErrorResponse);
  }

  function setApiKeysIfAvailable() {
    const retrievedOpenAiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? localStorage.getItem("openAiApiKey");
    const retrievedGeminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? localStorage.getItem("geminiApiKey");
    const retrievedAnthropicApiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ?? localStorage.getItem("anthropicApiKey");

    setOpenAiApiKey(retrievedOpenAiApiKey ?? "");
    setGeminiApiKey(retrievedGeminiApiKey ?? "");
    setAnthropicApiKey(retrievedAnthropicApiKey ?? "");
  }

  useEffect(() => {
    setApiKeysIfAvailable();
  }, []);

  return (
    <main className="flex min-h-screen flex-col h-[100vh]">
      {settingsOpen ? <Settings setSettingsOpen={setSettingsOpen} openAiApiKey={openAiApiKey} anthropicApiKey={anthropicApiKey} geminiApiKey={geminiApiKey} setAnthropicApiKey={setAnthropicApiKey} setGeminiApiKey={setGeminiApiKey} setOpenAiApiKey={setOpenAiApiKey} /> : null}
      <AppBar setSettingsOpen={setSettingsOpen} performLlmQuery={performLlmQuery} inputRef={inputRef} isWaiting={isWaiting} />
      <div className=" bg-[#161616] h-fit mx-2 mt-40 lg:mt-20 xl:mx-16 rounded-t-[3rem] xl:mt-20 grid grid-cols-1 lg:grid-cols-2">
        <ChatView modelRef={selectedOpenAiModelRef} messages={openAiMessages} provider={"openai"} ref={ref} />
        <ChatView modelRef={selectedGeminiModelRef} messages={geminiMessages} provider={"gemini"} ref={ref} />
        <ChatView modelRef={selectedAnthropicModelRef} messages={anthropicMessages} provider={"anthropic"} ref={ref} />
        <AddChatView />
      </div>
    </main>
  );
}
