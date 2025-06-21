// layout/ChatPageView.tsx
import React from "react";
import Chats from "../Components/Chats";
import ViewChat from "../Components/ViewChat";
import { useChatContext } from "../context/ChatContext";

const ChatPageView = () => {
  const { selectedChatId } = useChatContext();

  return (
    <div className="h-[90dvh] flex w-full border border-gray-300 bg-white">
      {/* Left - Chat List */}
      <div className={`w-full sm:w-[30%] ${selectedChatId ? 'hidden sm:block' : 'block'} border-r border-gray-300`}>
        <Chats />
      </div>

      {/* Right - Chat View */}
      <div className={`w-full sm:w-[70%] ${selectedChatId ? 'block' : 'hidden sm:block'}`}>
        <ViewChat />
      </div>
    </div>
  );
};

export default ChatPageView;
