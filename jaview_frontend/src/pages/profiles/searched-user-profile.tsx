import { useLocation } from "react-router-dom";
import { Review } from "../../types/review-type";

export default function SearchedUserProfile() {
  const location = useLocation();
  const { user } = location.state;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-200">
        {user.name}'s reviews
      </h1>
      {user.reviews.length === 0 ? (
        <p className="text-center text-gray-500">
          This user hasn't reviewed any movies yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {user.reviews.map((review: Review) => (
            <li
              key={review._id}
              className="bg-gray-900 rounded-lg shadow-lg p-6"
            >
              <div className="flex">
                <img
                  src={`https://image.tmdb.org/t/p/w200${review.movie?.poster_path}`}
                  alt={review.movie?.title}
                  className="w-24 h-36 rounded-lg shadow-black shadow-2xl"
                />
                <div className="ml-6 flex-grow">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-200">
                      {review.movie?.title}
                    </h2>
                  </div>
                  <p className="text-orange-400 mt-2 text-lg">
                    {review.rating} <span className="text-gray-600">/ 5</span>
                  </p>
                  <p className="text-slate-200 mt-2">{review.review}</p>
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
