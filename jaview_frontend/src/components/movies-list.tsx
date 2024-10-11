import { FetchMovies } from "../api/tmdb-api";
import React, { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

const MoviesList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      const movieData = await FetchMovies();
      setMovies(movieData);
      setLoading(false);
    };

    getMovies();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ml-5 mr-5 mb-5">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto rounded-2xl"
          />
          <div className="flex items-center mt-2">
            <p className="text-lg font-bold text-white bg-orange-400 rounded-full w-11 h-11 flex items-center justify-center mr-2">
              {movie.vote_average.toFixed(1)}
            </p>
            <h3 className="text-lg font-semibold">{movie.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesList;
