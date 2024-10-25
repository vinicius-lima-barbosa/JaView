import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../types/user-type";

const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function SearchUser() {
  const [searchUser, setSearchUser] = useState("");
  const [results, setResults] = useState<User[]>([]);

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
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Enter username"
          className="input input-bordered w-full max-w-md text-black"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-6">
          {results.map((user) => (
            <li
              key={user._id}
              className="p-4 shadow-sm hover:shadow-md mb-2 border rounded-md text-white"
            >
              <Link
                to={`/users/${user._id}`}
                className="font-semibold text-blue-600"
              >
                {user.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
