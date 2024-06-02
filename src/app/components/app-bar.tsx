import Image from "next/image";
import SettingsIcon from "../icons/SettingsIcon";
import DeleteIcon from "../icons/DeleteIcon";
import DisplayGridIcon from "../icons/DisplayGridIcon";

export default function AppBar(props: any) {
  return (
    <div className="w-full pb-6 flex flex-col text-white fixed backdrop-blur-[2px]">
      <div className="flex lg:items-center py-4 px-4 gap-4 flex-row w-full object-contain">
        <Image src="/logo.png" className="object-contain" alt="logo" width={130} height={40} />
        <p className="w-24 text-xs">let&apos;s actually compare these models 🤨</p>
      </div>
      <div className="w-full lg:absolute mt-4 flex h-fit  items-center justify-center px-4">
        <input
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              props.performLlmQuery();
            }
          }}
          disabled={props.isWaiting}
          ref={props.inputRef}
          className="w-full sm:w-[30rem] h-10 rounded-full px-4 text-black"
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
      <div className="flex mr-0 relative lg:absolute right-0 lg:mr-20">
        <button
          onClick={() => {
            props.clearAllChats();
          }}
          className="p-4 flex items-center text-xl font-bold"
        >
          <DeleteIcon />
        </button>
        <button
          onClick={() => {
            alert("Display change not implemented yet");
          }}
          className="p-4 flex items-center text-xl font-bold"
        >
          <DisplayGridIcon />
        </button>
      </div>
    </div>
  );
}
