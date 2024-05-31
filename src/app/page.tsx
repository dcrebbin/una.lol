import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col h-[100vh]">
      <div className="w-full h-20 flex lg:fixed">
        <div className="flex items-center px-4 gap-4 mt-3 lg:mt-1">
          <Image src="/logo.svg" alt="logo" width={200} height={200} />
          <p className="w-24 text-xs">let&apos;s actually compare these models 🤨</p>
        </div>
      </div>
      <div className="mt-4 w-full flex items-center justify-center">
        <input className="w-[20rem] sm:w-[30rem] h-10 rounded-full px-4" type="text" placeholder="Query" />
      </div>
      <div className=" bg-[#161616] h-fit mx-2 xl:mx-16 rounded-t-[3rem] mt-4 xl:mt-8 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-red-500 m-6 h-[30rem]"></div>
        <div className="bg-blue-500 m-6 h-[30rem]"></div>
        <div className="bg-green-500 m-6 h-[30rem]"></div>
        <div className="bg-yellow-500 m-6 h-[30rem]"></div>
      </div>
    </main>
  );
}
