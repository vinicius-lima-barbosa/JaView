import { useState } from "react";
import avatar from "../images/default_avatar.jpg";
import { AiOutlineMenu } from "react-icons/ai";

export default function Aside() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="block lg:hidden p-4 text-gray-400 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </button>

      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block lg:w-1/5 bg-gray-800 p-4 min-h-screen absolute lg:relative z-50 w-full`}
      >
        <div className="flex items-center m-2 mb-8">
          <img src={avatar} alt="avatar" className="rounded-full mr-4 w-14" />
          <span className="text-white">Hi, user</span>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                My reviews
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Most rated movies
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Login
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
