import { MdOutlineAttachFile, MdGroups } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';
import loginimg from '../assets/loginimg.svg';
import { useState, useRef, useEffect } from 'react';
import { GetAllMessage, SendMessage } from '../apis/MessageApi';
import { useChatContext } from "../context/ChatContext";

// Define the user type
type User = {
  _id: string;
  username: string;
  phone: string;
  avatar?: string;
};

const ViewChat = () => {
  const { selectedChatId, setSelectedChatId } = useChatContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [chatName, setChatName] = useState('');
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userId = localStorage.getItem('userId');

  const GetAllMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const res = await GetAllMessage(chatId);
      setMessages(res.data.messages);
      setChatName(res.data.chatname || '');

      if (res.data.reciver) {
        setReceiver(res.data.reciver);
        setChatUsers([]);
      } else {
        setReceiver(null);
        const uniqueUsers = Array.from(
          new Map((res.data.users || []).map((user: User) => [user._id, user])).values()
        ) as User[];
        setChatUsers(uniqueUsers);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const SendMessages = async (content: string, chatId: string) => {
    try {
      const res = await SendMessage(content, chatId);
      setMessages([...messages, res.data.fullMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!selectedChatId) return;

    GetAllMessages(selectedChatId);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedChatId]);

  if (!selectedChatId) {
    return (
      <div className="flex-1 hidden sm:flex items-center justify-center bg-gray-100 h-[90dvh] border border-gray-300">
        <h1 className="text-gray-500 text-lg sm:text-xl font-semibold">Welcome to LoveChat 💚</h1>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 sm:h-[90dvh] h-[90dvh] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="w-full border-b border-gray-300 flex items-center gap-3 px-4 py-3 bg-white relative">
        
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 border border-gray-400 rounded-full cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {receiver?.avatar ? (
              <img src={receiver.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
            ) : receiver ? (
              <img src={loginimg} alt="Default" className="w-full h-full rounded-full object-cover" />
            ) : (
              <MdGroups className="text-xl text-gray-600" />
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 z-50 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-4">
              {receiver ? (
                <div className="flex items-center gap-3">
                  <img src={receiver.avatar || loginimg} alt="User" className="w-10 h-10 rounded-full border object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{receiver.username}</p>
                    <p className="text-xs text-gray-500">{receiver.phone}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-sm mb-2">Group Members:</p>
                  {chatUsers.map((user, index) => (
                    <div key={`${user._id}-${index}`} className="flex items-center gap-2 mb-2">
                      <img src={user.avatar || loginimg} alt={user.username} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="space-y-1">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {receiver ? receiver.username : chatName || 'Group'}
              </p>
              {!receiver && (
                <div className="flex flex-wrap gap-1 text-xs sm:text-sm text-gray-600 max-w-full break-words">
                  {chatUsers.map((u, index) => (
                    <span key={`${u._id}-${index}`} className="truncate">
                      {u.username},
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="sm:hidden pr-2">
          <button onClick={() => setSelectedChatId(null)} className="text-gray-600 hover:text-black">
            ← 
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-10">No messages yet</div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((data, i) => {
              const isCurrentUser = data?.sender?._id === userId;
              return (
                <div
                  key={i}
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    isCurrentUser ? 'self-end bg-green-100 text-right' : 'self-start bg-gray-200 text-left'
                  }`}
                >
                  <p className="text-sm">{data.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full border-t border-gray-300 flex items-center gap-2 px-3 py-2 bg-white">
        <button className="text-xl text-gray-600 hover:text-gray-800">
          <MdOutlineAttachFile />
        </button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={() => {
            if (selectedChatId && message.trim()) {
              SendMessages(message, selectedChatId);
              setMessage('');
            }
          }}
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
        >
          <IoMdSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ViewChat;
