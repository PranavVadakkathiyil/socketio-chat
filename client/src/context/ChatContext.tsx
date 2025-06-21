import React, { createContext, useContext, useState } from "react";

type ChatContextType = {
  selectedChatId: string | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ selectedChatId, setSelectedChatId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
