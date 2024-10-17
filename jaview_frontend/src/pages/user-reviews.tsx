import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Review {
  _id: string;
  id: string;
  review: string;
  movie_id: string;
  rating: number;
  created_at: string;
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    runtime: number;
    overview: string;
  };
}

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_URL;
const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function UserReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/error", { state: { message: "You must be logged in!" } });
          return;
        }

        const response = await fetch(`${API_BACKEND}user/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const getDetails = await Promise.all(
          data.reviews.map(async (review: Review) => {
            const movieResponse = await fetch(
              `${BASE_URL}${review.movie_id}?api_key=${apiKey}`
            );
            const movieData = await movieResponse.json();
            return {
              ...review,
              movie: movieData,
            };
          })
        );

        setReviews(getDetails);
        setLoading(false);
      } catch (error) {
        console.log(error);
        navigate("/error", { state: { message: "An error occurred!" } });
      }
    };

    fetchReviews();
  }, [navigate]);

  const handleDeleteReview = async (movieId: string, reviewId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/error", { state: { message: "You must be logged in!" } });
        return;
      }

      const response = await fetch(
        `${API_BACKEND}movies/${movieId}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE",
        }
      );

      if (response.ok) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } else {
        navigate("/error", {
          state: { message: "Failed to delete the review." },
        });
      }
    } catch (error) {
      console.log(error);
      navigate("/error", { state: { message: "Error deleting review!" } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BallTriangle />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-200">
        Your Reviews
      </h1>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't reviewed any movies yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="bg-slate-200 rounded-lg shadow-lg p-6"
            >
              <div className="flex">
                <img
                  src={`https://image.tmdb.org/t/p/w200${review.movie.poster_path}`}
                  alt={review.movie.title}
                  className="w-24 h-36 rounded-lg shadow-black shadow-2xl"
                />
                <div className="ml-6 flex-grow">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {review.movie.title}
                    </h2>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                      onClick={() =>
                        handleDeleteReview(review.movie_id, review._id)
                      }
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                  <p className="text-orange-400 mt-2 text-lg">
                    {review.rating} <span className="text-gray-600">/ 5</span>
                  </p>
                  <p className="text-gray-700 mt-2">{review.review}</p>
                  <p className="text-gray-500 text-sm mt-4">
                    Reviewed on:{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
