import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsFillFileEarmarkTextFill, BsHourglassSplit } from "react-icons/bs";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  runtime: number;
  overview: string;
};

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_URL;
const imagesURL = import.meta.env.VITE_IMAGE;

export default function MoviesDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  const getMovie = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setMovie(data);
  };

  useEffect(() => {
    const movieUrl = `${BASE_URL}${id}?api_key=${apiKey}`;
    getMovie(movieUrl);
  }, [id]);

  return (
    <div className="min-h-screen flex justify-center items-center p-5">
      {movie && (
        <div className="max-w-6xl flex flex-col md:flex-row items-center md:items-start gap-8 bg-gray-900 p-5 rounded-lg shadow-2xl">
          <img
            src={imagesURL + movie.poster_path}
            alt={movie.title}
            className="rounded-2xl shadow-2xl w-full max-w-sm md:w-80"
          />

          <div className="flex flex-col justify-start items-start text-pretty">
            <div className="flex items-center mb-4">
              <p className="text-lg font-bold text-white bg-orange-400 rounded-full p-2 w-11 h-11 flex items-center justify-center mr-4 shadow-2xl">
                {movie.vote_average.toFixed(1)}
              </p>
              <h3 className="text-2xl font-semibold">{movie.title}</h3>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <BsHourglassSplit className="text-lg" />
              <p>{movie.runtime} minutes</p>
            </div>

            <div className="flex items-start space-x-2">
              <BsFillFileEarmarkTextFill className="text-lg" />
              <p className="max-w-lg text-justify">{movie.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
