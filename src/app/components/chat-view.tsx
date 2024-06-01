import Image from "next/image";
import { ANTHROPIC_MODELS, GEMINI_MODELS, OPEN_AI_MODELS } from "@/constants/config";

export default function ChatView(props: any) {
  function determineModelList() {
    switch (props.provider) {
      case "openai":
        return OPEN_AI_MODELS;
      case "anthropic":
        return ANTHROPIC_MODELS;
      case "gemini":
        return GEMINI_MODELS;
    }
  }

  function determineImage() {
    switch (props.provider) {
      case "openai":
        return "/icons/llms/openai.png";
      case "anthropic":
        return "/icons/llms/anthropic.png";
      case "gemini":
        return "/icons/llms/gemini.png";
    }
  }

  return (
    <div className="m-6 h-[30rem] overflow-y-auto border-white border-2 p-3 rounded-lg">
      <div className="flex gap-4">
        <div className="bg-white p-2 rounded-xl w-24 flex items-center">
          <Image src={`${determineImage()}`} objectFit="contain" alt="logo" width={100} height={100} />
        </div>
        <div className="flex items-center">
          <p>Model:</p>
          <select ref={props.modelRef} className="bg-[#161616] text-white rounded-full w-fit h-8 font-bold">
            {determineModelList()?.map((model) => (
              <option key={model.key} value={model.key}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        {props.messages.map((message: any, index: number) => (
          <div key={index} className="flex gap-4">
            <div className="p-2 rounded-xl flex items-center">
              <p className="w-20 font-bold">{message.role}:</p>
            </div>
            <div className=" p-2 rounded-xl flex items-center">
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
