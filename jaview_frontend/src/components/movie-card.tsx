const imagesURL = import.meta.env.VITE_IMAGE;
import { Movie } from "../types/movie-type";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div>
      <img
        src={imagesURL + movie.poster_path}
        alt={movie.title}
        className="rounded-2xl transition duration-200 hover:brightness-75 shadow-2xl"
      />
      <div className="flex items-center mt-2">
        <p className="text-lg font-bold text-white bg-orange-400 rounded-full p-2 w-11 h-11 flex items-center justify-center mr-2 shadow-2xl">
          {movie.vote_average.toFixed(1)}
        </p>
        <h3 className="text-md font-semibold">{movie.title}</h3>
      </div>
    </div>
  );
}
