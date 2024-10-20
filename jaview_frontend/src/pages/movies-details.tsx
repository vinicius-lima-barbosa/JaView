import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillFileEarmarkTextFill, BsHourglassSplit } from "react-icons/bs";

//test

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  runtime: number;
  overview: string;
};

type Review = {
  user: string;
  rating: number;
  review: string;
  user_id: {
    name: string;
  };
};

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_URL;
const imagesURL = import.meta.env.VITE_IMAGE;
const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function MoviesDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  const getMovie = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    setMovie(data);
  };

  const getMovieReviews = async () => {
    const response = await fetch(`${API_BACKEND}movies/${id}/reviews`);
    const data = await response.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    const movieUrl = `${BASE_URL}${id}?api_key=${apiKey}`;
    getMovie(movieUrl);
    getMovieReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/error", { state: { message: "You must be logged in!" } });
      return;
    }

    try {
      const response = await fetch(`${API_BACKEND}movies/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ review, rating }),
      });

      if (!response.ok) {
        navigate("/error", {
          state: { message: "An error occurred while sending the review!" },
        });
      }

      setReview("");
      setRating("");
      navigate("/success");
      getMovieReviews();
    } catch (error) {
      console.log(error);
      navigate("/error", {
        state: { message: "An error occurred!" },
      });
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

            <div className="w-full mt-8">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md"
                  >
                    <p className="text-green-500 font-bold">
                      {review.user_id.name}
                    </p>
                    <p>
                      Rating:{" "}
                      <span className="text-orange-400">{review.rating}</span>
                    </p>
                    <p>{review.review}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet for this movie.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
