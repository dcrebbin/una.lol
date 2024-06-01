"use client";
import { OPEN_AI_MODELS } from "@/constants/config";
import Image from "next/image";
import React, { useRef } from "react";
import { useState } from "react";

export default function Home() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [messages, setMessages] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  async function chatApiRequest() {
    const query = inputRef.current?.value;
    const response = await fetch("/api/openai/generate-message", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: query }],
      }),
    });
    setMessages([...messages, query]);
    const data = await response.json();
    ref && ref.current && (ref.current.innerText = data.content);
  }

  return (
    <main className="flex min-h-screen flex-col h-[100vh]">
      <div className="w-full h-20 flex lg:fixed">
        <div className="flex items-center px-4 gap-4 absolute h-full">
          <Image src="/logo.png" alt="logo" width={130} height={130} />
          <p className="w-24 text-xs">let&apos;s actually compare these models 🤨</p>
        </div>
        <div className="w-full flex items-center justify-center">
          <input ref={inputRef} className="w-[20rem] sm:w-[30rem] h-10 rounded-full px-4 text-black" type="text" placeholder="Query" />
          <button className="h-18 w-18 rounded-full  text-white text-3xl" onClick={chatApiRequest}>
            🔍
          </button>
        </div>
      </div>
      <div className=" bg-[#161616] h-fit mx-2 xl:mx-16 rounded-t-[3rem] xl:mt-20 grid grid-cols-1 lg:grid-cols-2">
        <div className="m-6 h-[30rem] overflow-y-auto border-white border-2 p-3 rounded-lg">
          <div className="flex gap-4">
            <Image src="/icons/llms/openai.png" className="invert" alt="logo" width={130} height={50} />
            <div className="flex items-center">
              <p>Model:</p>
              <select className="bg-[#161616] text-white rounded-full w-24 h-8 font-bold">
                {OPEN_AI_MODELS.map((model) => (
                  <option key={model.key} value={model.key}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="p-3" ref={ref}>
            This is some text
          </p>
        </div>
        <div className="bg-blue-500 m-6 h-[30rem]"></div>
        <div className="bg-green-500 m-6 h-[30rem]"></div>
        <div className="bg-yellow-500 m-6 h-[30rem]"></div>
      </div>
    </main>
  );
}
