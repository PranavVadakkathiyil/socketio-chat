import { useState, useRef, useEffect } from "react";
import { BsFillChatHeartFill } from "react-icons/bs";
import { HiBell } from "react-icons/hi";
import { IoMdContact } from "react-icons/io";
import loginimg from '../assets/loginimg.svg';

const Header = () => {
  const [showDropdown, setshowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Optional: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setshowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white ">
      <div>
        <p className="flex items-center gap-1 text-2xl text-gray-800 font-bold">
          <BsFillChatHeartFill className="text-[#92E3A9] text-2xl" />
          <span>lovechat</span>
        </p>
      </div>

      <div>
        <ul className="flex gap-4 items-center relative">
          <li className="relative">
            <HiBell className="text-3xl text-gray-400" />
            <span className="absolute -top-2 -right-2 bg-white border border-green-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
              2
            </span>
          </li>

          {/* User Image + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={loginimg}
              alt="User"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer border border-gray-300 object-cover"
              onClick={() => setshowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute top-full mt-2 right-0 z-50 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-4">
                <div className="flex items-center gap-3 mb-3">
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
                <button
                  // onClick={handleLogout}
                  className="w-full text-left text-red-600 text-sm hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <li>
            <IoMdContact className="text-3xl text-gray-400" />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
