import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types/user-type";
import { IoIosSearch } from "react-icons/io";

const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function SearchUser() {
  const [searchUser, setSearchUser] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchUser.trim() === "") return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BACKEND}user/search-user?username=${searchUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      setResults(data.users || []);
    } catch (error) {
      console.error("Error searching for users:", error);
      navigate("/error", { state: { message: "An error occurred!" } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Search Users</h2>
      <div className="flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-full shadow-md mr-4 p-1 mb-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="outline-none px-3 py-1 text-gray-700 w-full"
        />
        <button onClick={handleSearch} className="text-green-700 p-1">
          <IoIosSearch size={24} />
        </button>
      </div>

      {results.length > 0 && (
        <>
          <h1 className="text-xl font-bold text-center">
            Users found: {results.length}
          </h1>
          <ul className="mt-6 bg-gray-900 rounded-lg">
            {results.map((user) => (
              <li key={user._id} className="p-4">
                <Link
                  to={`/users/${user._id}`}
                  className="font-semibold text-green-500 hover:text-green-200 transition-all duration-200"
                >
                  {user.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
