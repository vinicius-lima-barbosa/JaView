import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsFillFileEarmarkTextFill, BsHourglassSplit } from "react-icons/bs";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
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
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number | "">("");

  const getMovie = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    setMovie(data);
  };

  useEffect(() => {
    const movieUrl = `${BASE_URL}${id}?api_key=${apiKey}`;
    getMovie(movieUrl);
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to submit a review!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3333/movies/post/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ review, rating }),
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred while sending the review!");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("An error occured!");
    }
  };

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

            <form onSubmit={handleReviewSubmit} className="w-full mt-4">
              <label htmlFor="review" className="block text-white mb-2">
                Write your review:
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                placeholder="Share your opinion about the movie..."
                required
              />

              <label htmlFor="rating" className="block text-white mt-4 mb-2">
                Rate the movie (0-5):
              </label>
              <input
                id="rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                placeholder="Give a rating..."
                required
              />

              <button
                type="submit"
                className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
