import ChatScreen from "./components/ChatScreen";
import UploadFile from "./components/UploadFile";

export default function Home() {
  return (
    <div className="flex flex-row flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black h-screen">
      <UploadFile />
      <ChatScreen />
    </div>
  );
}
