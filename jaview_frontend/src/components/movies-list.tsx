import { FetchMovies } from "../api/tmdb-api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./movie-card";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ml-5 mr-5 mb-5">
      {movies.map((movie) => (
        <Link key={movie.id} className="movie-card" to={`/movie/${movie.id}`}>
          <MovieCard key={movie.id} movie={movie} />
        </Link>
      ))}
      <div className="flex justify-around items-center mt-3">
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="font-medium">Page {page}</span>
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MoviesList;
