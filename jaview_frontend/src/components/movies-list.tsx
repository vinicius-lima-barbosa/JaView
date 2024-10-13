import { FetchMovies } from "../api/tmdb-api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./movie-card";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

const MoviesList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getMovies = async () => {
      const movieData = await FetchMovies(page);
      setMovies(movieData);
      setLoading(false);
    };

    getMovies();
  }, [page]);

  if (loading) return <div>Loading...</div>;

  const filteredMovies = movies.filter((movie) => movie.poster_path);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ml-5 mr-5 mb-5">
      {filteredMovies.map((movie) => (
        <Link key={movie.id} className="movie-card" to={`/movie/${movie.id}`}>
          <MovieCard key={movie.id} movie={movie} />
        </Link>
      ))}
      <div className="flex justify-center items-center mt-5 space-x-4">
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="font-medium text-gray-700 text-lg">Page {page}</span>
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
