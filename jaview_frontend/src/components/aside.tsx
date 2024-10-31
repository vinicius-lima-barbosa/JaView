import { useState, useEffect } from "react";
import avatar from "../assets/images/avatar/default_avatar.jpg";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import {
  FaUser,
  FaStar,
  FaFilm,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavItem from "./nav-items";

const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function Aside() {
  const [isExpanded, setIsExpanded] = useState(true);
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
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-md shadow-md"
      >
        {isExpanded ? (
          <AiOutlineClose size={24} />
        ) : (
          <AiOutlineMenu size={24} />
        )}
      </button>

      <aside
        className={`${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transform lg:w-64 w-64 bg-gray-800 p-4 min-h-screen transition-transform duration-300 fixed lg:relative z-40 shadow-xl`}
      >
        <div className="flex items-center mb-8">
          <img
            src={avatar}
            alt="avatar"
            className="rounded-full w-14 h-14 object-cover border-2 border-white"
          />
          <span className="text-white font-semibold text-lg ml-4">
            Hi, {userName}
          </span>
        </div>

        <nav>
          <ul className="space-y-4">
            {loggedIn && (
              <>
                <NavItem
                  to="/profile"
                  icon={<FaUser size={20} />}
                  label="Profile"
                  isExpanded={true}
                />
                <NavItem
                  to="/user/reviews"
                  icon={<FaStar size={20} />}
                  label="My Reviews"
                  isExpanded={true}
                />
              </>
            )}
            <NavItem
              to="/top-rated-movies"
              icon={<FaFilm size={20} />}
              label="Top Rated Movies"
              isExpanded={true}
            />
            <NavItem
              to="/search-user"
              icon={<FaSearch size={20} />}
              label="Search Users"
              isExpanded={true}
            />
            {!loggedIn ? (
              <NavItem
                to="/login"
                icon={<FaSignInAlt size={20} />}
                label="Login"
                isExpanded={true}
                color="text-green-500"
              />
            ) : (
              <li className="flex items-center space-x-2">
                <FaSignOutAlt size={20} className="text-red-500" />
                <button
                  className="text-red-500 hover:text-white text-lg transition-all duration-200"
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
