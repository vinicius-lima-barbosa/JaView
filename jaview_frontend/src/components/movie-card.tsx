const imagesURL = "https://image.tmdb.org/t/p/w500/";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div>
      <img
        src={imagesURL + movie.poster_path}
        alt={movie.title}
        className="w-min-full h-min-full rounded-2xl transition duration-200 hover:brightness-75"
      />
      <div className="flex items-center mt-2">
        <p className="text-lg font-bold text-white bg-orange-400 rounded-full p-2 w-11 h-11 flex items-center justify-center mr-2">
          {movie.vote_average.toFixed(1)}
        </p>
        <h3 className="text-md font-semibold">{movie.title}</h3>
      </div>
    </div>
  );
}
