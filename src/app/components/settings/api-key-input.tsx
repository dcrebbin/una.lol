import React, { useRef } from "react";

export default function ApiKeyInput(props: any) {
  const keyInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-row justify-between">
      <div className="font-bold">{props.provider}</div>
      <div>
        <input
          onChange={(e) => {
            props.setApiKey(e.target.value);
          }}
          value={props.apiKey}
          placeholder="sk-"
          ref={keyInput}
          type="text"
          className=" h-min border-black border-b-2"
        ></input>
        <button
          onClick={() => {
            if (keyInput?.current?.value) {
              const newApiKey = keyInput?.current?.value;
              window.localStorage.setItem(props.apiKeyName, newApiKey);
              props.setApiKey(newApiKey);
              alert("API Key Saved");
            } else {
              window.localStorage.removeItem(props.apiKeyName);
              props.setApiKey("");
              alert("API Key Removed");
            }
          }}
          className="bg-black m-3 p-1 text-white rounded-md font-sans text-xl"
        >
          Save
        </button>
      </div>
    </div>
  );
}
