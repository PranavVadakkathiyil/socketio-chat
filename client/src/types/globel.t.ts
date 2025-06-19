// src/types/chat.d.ts
export {};

declare global {
  interface User {
  _id: string;
  username: string;
  phone: string;
  password: string;
  avatar: string;
  Isadmin: boolean;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  sender: User | string;
  content: string;
  chats: string | Chat;
  readedBy: (User | string)[];
  createdAt: string;
  updatedAt: string;
}

interface Chat {
  _id: string;
  chatname: string;
  isGroupChat: boolean;
  users: (User | string)[];
  latestMessage?: Message ;
  groupAdmin?: User | string;
  createdAt: string;
  updatedAt: string;
}

}
