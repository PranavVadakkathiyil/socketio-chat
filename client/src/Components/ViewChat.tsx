import { MdOutlineAttachFile } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';
import loginimg from '../assets/loginimg.svg';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewChat = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {id} = useParams()
  console.log(id);
  

  // Optional: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="border border-gray-300 sm:h-[90dvh] h-[100dvh] flex flex-col bg-gray-50">

      {/* Header */}
      <div className="w-full border-b border-gray-300 flex items-center gap-3 px-4 py-3 bg-white relative">
        <div className="relative" ref={dropdownRef}>
          <img
            src={loginimg}
            alt="User"
            className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-400 rounded-full object-cover cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 z-50 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-4">
              <div className="flex items-center gap-3">
                <img
                  src={loginimg}
                  alt="User"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pranav</p>
                  <p className="text-xs text-gray-500">+91 9876543210</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm sm:text-base">Pranav</p>
          <p className="text-xs sm:text-sm text-gray-600">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 30 }).map((_, i) =>
            i % 2 === 0 ? (
              <div key={i} className="self-start max-w-[70%] bg-gray-200 px-4 py-2 rounded-lg">
                <p className="text-sm">Hello! Message {i + 1}</p>
              </div>
            ) : (
              <div key={i} className="self-end max-w-[70%] bg-green-500 text-white px-4 py-2 rounded-lg">
                <p className="text-sm">Hi! Response {i + 1}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer */}
       <div className="w-full border-t border-gray-300 flex items-center gap-2 px-3 py-2 bg-white">
    <button className="text-xl text-gray-600 hover:text-gray-800">
      <MdOutlineAttachFile />
    </button>
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300"
    />
    <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full">
      <IoMdSend className="text-xl" />
    </button>
  </div>
    </div>
  );
};

export default ViewChat;
