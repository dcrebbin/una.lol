import Image from "next/image";
import SettingsIcon from "../icons/SettingsIcon";

export default function AppBar(props: any) {
  return (
    <div className="w-full h-20 flex lg:fixed">
      <div className="flex items-center px-4 gap-4 absolute h-full">
        <Image src="/logo.png" alt="logo" width={130} height={130} />
        <p className="w-24 text-xs">let&apos;s actually compare these models 🤨</p>
      </div>
      <div className="w-full flex items-center justify-center">
        <input
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              props.performLlmQuery();
            }
          }}
          disabled={props.isWaiting}
          ref={props.inputRef}
          className="w-[20rem] sm:w-[30rem] h-10 rounded-full px-4 text-black"
          type="text"
          placeholder="Query"
        />
        {props.isWaiting ? (
          <p className="h-18 w-18  text-3xl animate-spin">⏳</p>
        ) : (
          <button className="h-18 w-18 rounded-full  text-white text-3xl" onClick={props.performLlmQuery}>
            🔍
          </button>
        )}
      </div>
      <button
        onClick={() => {
          props.setSettingsOpen(true);
        }}
        className="absolute right-0 p-4 flex items-center text-xl font-bold"
      >
        <SettingsIcon />
      </button>
    </div>
  );
}
