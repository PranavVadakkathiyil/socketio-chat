import { MdOutlineAttachFile, MdGroups } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';
import loginimg from '../assets/loginimg.svg';
import { useState, useRef, useEffect } from 'react';
import { GetAllMessage, SendMessage } from '../apis/MessageApi';
import { useChatContext } from "../context/ChatContext";
import { io, Socket } from 'socket.io-client';

type User = { _id: string; username: string; phone: string; avatar?: string; };

let socket: Socket;
let currentChatId: string | null = null;

const ViewChat = () => {
  const { selectedChatId } = useChatContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [chatName, setChatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketReady, setSocketReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const serverUrl = import.meta.env.VITE_BACKEND_URL!;
  const userId = localStorage.getItem('userId')!;

  // 1️⃣ Initialize socket once
  useEffect(() => {
    socket = io(serverUrl, { transports: ["websocket"] });
    socket.emit("setup", userId);
    socket.on("connected", () => setSocketReady(true));

    // Receive incoming messages
    socket.on("messageReceived", (newMsg) => {
      if (newMsg.chat._id === currentChatId) {
        setMessages((prev) => [...prev, newMsg]);
      } else {
        // optionally notify user of new message elsewhere
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  // 2️⃣ Load history & join room when chat changes
  useEffect(() => {
    if (!selectedChatId) return;
    currentChatId = selectedChatId;

    (async () => {
      setLoading(true);
      try {
        const res = await GetAllMessage(selectedChatId);
        setMessages(res.data.messages);
        setChatName(res.data.chatname || '');
        if (res.data.reciver) {
          setReceiver(res.data.reciver);
          setChatUsers([]);
        } else {
          setReceiver(null);
          const unique = Array.from(
            new Map(
              (res.data.users || []).map((u: User) => [u._id, u])
            ).values()
          ) as User[];
          setChatUsers(unique);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    socket.emit("joinChat", selectedChatId);

    const outside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // close dropdown...
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [selectedChatId]);

  const sendMsg = async () => {
    if (!message.trim() || !selectedChatId) return;
    try {
      const res = await SendMessage(message, selectedChatId);
      setMessages((prev) => [...prev, res.data.fullMessage]);
      socket.emit("newMessage", res.data.fullMessage);
      setMessage('');
    } catch (e) { console.error(e); }
  };

  // ...Your Header & Dropdown UI here...

  return (
    <div className="flex flex-col h-full border border-gray-300 bg-gray-50">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading
          ? <div className="spinner" />
          : messages.length === 0
            ? <p className="text-center text-gray-500">No messages</p>
            : messages.map((m, i) => {
                const mine = m.sender._id === userId;
                return (
                  <div key={i}
                    className={`max-w-[70%] px-4 py-2 my-1 rounded ${mine ? 'self-end bg-green-100' : 'self-start bg-gray-200'}`}>
                    {m.content}
                  </div>
                );
              })
        }
      </div>

      {/* Footer */}
      <div className="flex items-center p-3 border-t bg-white">
        <button><MdOutlineAttachFile /></button>
        <input
          className="flex-1 mx-2 border rounded-full px-4 py-2"
          placeholder="Type a message…"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
        />
        <button onClick={sendMsg} className="p-2 bg-green-500 rounded-full text-white">
          <IoMdSend />
        </button>
      </div>
    </div>
  );
};

export default ViewChat;
