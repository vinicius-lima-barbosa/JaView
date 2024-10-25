import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../../components/movie-card";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

const searchURL = import.meta.env.VITE_SEARCH;
const apiKey = import.meta.env.VITE_API_KEY;

export default function Search() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("q");

  const getSearchedMovies = async (url: string) => {
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setMovies(data.results);
    setLoading(false);
  };

  useEffect(() => {
    const searchWithQueryURL = `${searchURL}?api_key=${apiKey}&query=${query}`;
    getSearchedMovies(searchWithQueryURL);
  }, [query]);

  const filteredMovies = movies.filter((movie) => movie.poster_path);

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-3xl font-bold text-center mb-5">
        Results for: <span className="text-green-500">{query}</span>
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-[100vh]">
          <BallTriangle />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                className="movie-card"
                to={`/movie/${movie.id}`}
              >
                <MovieCard key={movie.id} movie={movie} />
              </Link>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
