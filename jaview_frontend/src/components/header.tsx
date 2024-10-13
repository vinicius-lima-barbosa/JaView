import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 relative">
      <h1
        className="text-4xl font-bold cursor-pointer mb-4 sm:mb-0"
        onClick={() => navigate("/")}
      >
        JaView
      </h1>
      <div className="flex items-center w-full sm:w-auto">
        <div
          className={`${
            isSearchOpen ? "w-full sm:w-64 opacity-100" : "w-0 opacity-0"
          } overflow-hidden transition-all duration-300 ease-in-out flex items-center bg-white rounded-full shadow-md mr-4`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center"
          >
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-3 py-1 text-gray-700 w-full"
            />
            <button
              type="submit"
              className="text-green-500 hover:text-green-700 p-1"
            >
              <IoIosSearch size={24} />
            </button>
          </form>
        </div>
        <button
          className="bg-green-500 p-3 rounded-full"
          onClick={handleSearchClick}
        >
          <i className="text-white text-2xl">
            <IoIosSearch />
          </i>
        </button>
      </div>
    </header>
  );
}
