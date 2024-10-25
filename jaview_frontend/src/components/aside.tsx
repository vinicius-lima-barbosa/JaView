import { useState, useEffect } from "react";
import avatar from "../assets/images/avatar/default_avatar.jpg";
import { AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function Aside() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(`${API_BACKEND}user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchUserData();
    } else {
      setUserName("user");
    }
  }, [loggedIn]);

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
        } lg:block lg:w-1/5 bg-gray-800 p-4 min-h-screen absolute lg:relative z-50 w-full shadow-xl`}
      >
        <div className="flex items-center m-2 mb-8">
          <img
            src={avatar}
            alt="avatar"
            className="rounded-full mr-4 w-14 h-14 object-cover border-2 border-white"
          />
          <span className="text-white font-semibold text-lg">
            Hi, {userName}
          </span>
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to={"/profile"}
                className="block text-gray-300 hover:text-white text-lg transition-all duration-200"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/user/reviews"
                className="block text-gray-300 hover:text-white text-lg transition-all duration-200"
              >
                My Reviews
              </Link>
            </li>
            <li>
              <Link
                to="/topRatedMovies"
                className="block text-gray-300 hover:text-white text-lg transition-all duration-200"
              >
                Top Rated Movies
              </Link>
            </li>
            <li>
              <Link
                to={"/search-user"}
                className="block text-gray-300 hover:text-white text-lg transition-all duration-200"
              >
                Search users
              </Link>
            </li>
            {!loggedIn ? (
              <li>
                <Link
                  to="/login"
                  className="block text-green-500 hover:text-white text-lg transition-all duration-200"
                >
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <button
                  className="block text-red-500 hover:text-white text-lg transition-all duration-200"
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
