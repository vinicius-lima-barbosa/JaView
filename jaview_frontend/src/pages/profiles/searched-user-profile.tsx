import { useLocation } from "react-router-dom";
import { Review } from "../../types/review-type";
import avatar from "../../assets/images/avatar/default_avatar.jpg";

export default function SearchedUserProfile() {
  const location = useLocation();
  const { user } = location.state;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-100">
        Profile
      </h1>
      <div className="flex items-center bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt="avatar"
            className="rounded-full w-28 h-28 object-cover border-4 border-slate-700"
          />
        </div>
        <div className="ml-6 flex-grow">
          <div className="mb-4">
            <label className="text-sm font-semibold text-slate-300">Name</label>
            <div className="bg-slate-700 rounded-md p-2 mt-1 text-lg text-slate-100">
              {user.name}
            </div>
          </div>
          {user.bio && (
            <div>
              <label className="text-sm font-semibold text-slate-300">
                Bio
              </label>
              <div className="bg-slate-700 rounded-md p-2 mt-1 text-lg text-slate-100">
                {user.bio}
              </div>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-100">
        Reviews
      </h1>
      {user.reviews.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          This user hasn't reviewed any movies yet.
        </p>
      ) : (
        <div className="space-y-6">
          {user.reviews.map((review: Review) => (
            <div
              key={review._id}
              className="bg-gray-900 rounded-lg shadow-lg p-6 flex items-start"
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${review.movie?.poster_path}`}
                alt={review.movie?.title}
                className="w-24 h-36 rounded-lg shadow-md mr-6"
              />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-slate-100">
                  {review.movie?.title}
                </h2>
                <p className="text-orange-400 mt-1 text-lg font-semibold">
                  {review.rating} <span className="text-gray-500">/ 5</span>
                </p>
                <p className="text-slate-200 mt-3 leading-relaxed">
                  {review.review}
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  Reviewed on:{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
