import React, { SVGProps, useRef, useState } from "react";
import ApiKeyInput from "./api-key-input";

function MdiGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
    </svg>
  );
}

export default function Settings(props: any) {
  return (
    <div className="relative z-50 text-black" aria-labelledby="modal-title" aria-modal="true">
      <button
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={() => {
          props.setSettingsOpen(false);
        }}
      ></button>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto pointer-events-none">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="top-0 m-10 absolute transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-xl font-bold leading-6 text-gray-900" id="modal-title">
                    Settings
                  </h3>
                  <p className="text-xs">
                    {"("}We only save your API key to local storage to then pass it to an API route within the app, too sus for you? Feel feel to deploy it locally! 🤠
                    {")"}
                  </p>
                  <hr></hr>
                  <ApiKeyInput provider="Open AI" apiKey={props.openAiApiKey} setApiKey={props.setOpenAiApiKey} apiKeyName="openAiApiKey"></ApiKeyInput>
                  <ApiKeyInput provider="Gemini" apiKey={props.geminiApiKey} setApiKey={props.setGeminiApiKey} apiKeyName="geminiApiKey"></ApiKeyInput>
                  <ApiKeyInput provider="Anthropic" apiKey={props.anthropicApiKey} setApiKey={props.setAnthropicApiKey} apiKeyName="anthropicApiKey"></ApiKeyInput>
                </div>
              </div>
              <hr></hr>
              <div className="flex items-start flex-col justify-start mt-2">
                <p>Hey 👋</p>
                <div className="flex items-center gap-1">
                  <p>
                    We&apos;re <strong>open source!</strong> Find out more here
                  </p>
                  <a target="_" href="https://github.com/dcrebbin/una.lol">
                    <MdiGithub className="w-8 h-8 hover:text-blue-600"></MdiGithub>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
