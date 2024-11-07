import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types/user-type";
import { IoIosSearch } from "react-icons/io";
import { Review } from "../../types/review-type";
import { BallTriangle } from "react-loader-spinner";

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_URL;
const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function SearchUser() {
  const [searchUser, setSearchUser] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchUser.trim() === "") return;
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BACKEND}user/search-user?username=${searchUser}`
      );

      const data = await response.json();
      const usersWithMovieDetails = await Promise.all(
        data.users.map(async (user: User) => {
          const reviewsWithDetails = await Promise.all(
            user.reviews.map(async (review: Review) => {
              const movieResponse = await fetch(
                `${BASE_URL}${review.movie_id}?api_key=${apiKey}`
              );
              const movieData = await movieResponse.json();
              return {
                ...review,
                movie: movieData,
              };
            })
          );
          return {
            ...user,
            reviews: reviewsWithDetails,
          };
        })
      );

      setResults(usersWithMovieDetails || []);
    } catch (error) {
      console.error("Error searching for users:", error);
      navigate("/error", { state: { message: "An error occurred!" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <h2 className="text-4xl font-bold  mb-10 text-center">Find Users</h2>

      <div className="flex items-center w-80 md:w-96 shadow-lg rounded-full bg-white overflow-hidden transition duration-300 ease-in-out p-1 mb-10">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="outline-none px-4 py-2 text-gray-800 w-full rounded-l-full"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white p-2 rounded-full transition-all duration-300 hover:bg-green-600"
        >
          <IoIosSearch size={24} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <BallTriangle />
        </div>
      ) : results.length > 0 ? (
        <div className="w-full max-w-3xl mt-8">
          <h1 className="text-xl font-semibold mb-4">
            {results.length} Users Found
          </h1>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((user) => (
              <li
                key={user._id}
                className="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <Link
                  to={`/users/${user._id}`}
                  state={{ user }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-lg font-medium hover:text-slate-300">
                    {user.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg mt-8">No users found.</p>
      )}
    </div>
  );
}
