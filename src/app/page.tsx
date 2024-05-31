import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col h-[100vh]">
      <div className="w-full h-20 flex">
        <div className="flex items-center px-4 gap-4">
          <Image src="/logo.svg" alt="logo" width={200} height={200} />
          <p className="w-24 text-xs">let's actually compare these models 🤨</p>
        </div>
      </div>
      <div className="fixed mt-4 w-full flex items-center justify-center">
        <input className="w-[30rem] h-10 rounded-full px-4" type="text" placeholder="search" />
      </div>
      <div className=" bg-[#161616] h-full mx-10 rounded-t-[3rem] mt-4 "></div>
    </main>
  );
}
