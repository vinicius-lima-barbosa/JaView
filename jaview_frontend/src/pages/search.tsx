import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/movie-card";
import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

const searchURL = import.meta.env.VITE_SEARCH;
const apiKey = import.meta.env.VITE_API_KEY;

export default function Search() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const query = searchParams.get("q");

  const getSearchedMovies = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    setMovies(data.results);
  };

  useEffect(() => {
    const searchWithQueryURL = `${searchURL}?api_key=${apiKey}&query=${query}`;
    getSearchedMovies(searchWithQueryURL);
  }, [query]);

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-3xl font-bold text-center mb-5">
        Results for: <span className="text-green-500">{query}</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Link
              key={movie.id}
              className="movie-card"
              to={`/movie/${movie.id}`}
            >
              <MovieCard key={movie.id} movie={movie} />
            </Link>
          ))
        ) : (
          <p className="text-lg font-semibold">No results found</p>
        )}
      </div>
    </div>
  );
}
