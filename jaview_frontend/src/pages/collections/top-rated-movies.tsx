import { useEffect, useState } from "react";
import { FetchTopRatedMovies } from "../../api/tmdb-top-movies";
import { BallTriangle } from "react-loader-spinner";
import MovieCard from "../../components/movie-card";
import { Link } from "react-router-dom";
import { Movie } from "../../types/movie-type";

export default function TopRatedMovies() {
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getMovies = async () => {
      const movieData = await FetchTopRatedMovies(page);
      setTopMovies(movieData);
      setLoading(false);
    };

    getMovies();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BallTriangle />
      </div>
    );
  }

  const filteredMovies = topMovies.filter((movie) => movie.poster_path);

  return (
    <div className="min-h-screen">
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
        <span className="font-medium text-lg">Page {page}</span>
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-200"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
