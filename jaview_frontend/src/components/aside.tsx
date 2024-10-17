import { useState } from "react";
import avatar from "../images/default_avatar.jpg";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Aside() {
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

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
              <Link
                to={"/user/reviews"}
                className="text-gray-400 hover:text-white"
              >
                My reviews
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to={"/topRatedMovies"}
                className="text-gray-400 hover:text-white"
              >
                Top rated movies
              </Link>
            </li>
            {!token ? (
              <li className="mb-4">
                <Link to={"/login"} className="text-green-600 hover:text-white">
                  Login
                </Link>
              </li>
            ) : (
              <li className="mb-4">
                <button
                  className="text-red-600 hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}
