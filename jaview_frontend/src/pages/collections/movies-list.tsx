import { FetchMovies } from "../../api/tmdb-api";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MovieCard from "../../components/movie-card";
import { BallTriangle } from "react-loader-spinner";
import { Movie } from "../../types/movie-type";

const MoviesList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const [showMessage, setShowMessage] = useState<boolean>(
    !!location.state?.message
  );
  const message = location.state?.message;
  const type = location.state?.type || "success";

  useEffect(() => {
    const getMovies = async () => {
      const movieData = await FetchMovies(page);
      setMovies(movieData);
      setLoading(false);
    };

    getMovies();
  }, [page]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BallTriangle />
      </div>
    );
  }

  const filteredMovies = movies.filter((movie) => movie.poster_path);

  return (
    <div className="min-h-screen relative">
      {showMessage && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md text-center transition duration-500 ${
            type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ml-5 mr-5 mb-5">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} className="movie-card" to={`/movie/${movie.id}`}>
            <MovieCard key={movie.id} movie={movie} />
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center mt-5 mb-5 space-x-4">
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="font-medium text-white text-lg">Page {page}</span>
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-200"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MoviesList;
