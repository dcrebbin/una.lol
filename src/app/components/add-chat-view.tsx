export default function AddChatView(props: any) {
  function addChatView() {
    console.log("Add Chat View");
    alert("Not yet implemented");
  }

  return (
    <div className="m-6 h-[30rem]  p-3 text-9xl text-white flex items-center justify-center">
      <button onClick={addChatView}>+</button>
    </div>
  );
}
