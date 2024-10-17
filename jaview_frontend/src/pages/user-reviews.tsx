import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { FaRegTrashAlt } from "react-icons/fa";

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You have to login!");
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
        alert("An error occurred!");
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (movieId: string, reviewId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You have to login!");
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
        alert("Review deleted successfully!");
      } else {
        alert("Failed to delete the review.");
      }
    } catch (error) {
      console.log(error);
      alert("Error deleting review!");
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
      <h1 className="text-2xl font-bold mb-4">Your Reviews</h1>
      {reviews.length === 0 ? (
        <p>You haven't reviewed any movies yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} className="mb-6">
              <div className="flex">
                <img
                  src={`https://image.tmdb.org/t/p/w200${review.movie.poster_path}`}
                  alt={review.movie.title}
                  className="w-24 h-36 rounded-xl shadow-xl"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{review.movie.title}</h2>
                  <p className="text-orange-400">
                    {review.rating} <span className="text-gray-600">of 5</span>
                  </p>
                  <p>{review.review}</p>
                  <p className="text-gray-500 text-sm">
                    Reviewed on:{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <button
                    className="bg-red-500 text-white p-2 mt-4 rounded shadow-xl hover:bg-red-800"
                    onClick={() =>
                      handleDeleteReview(review.movie_id, review._id)
                    }
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
