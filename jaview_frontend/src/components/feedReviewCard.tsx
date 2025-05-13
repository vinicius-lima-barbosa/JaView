import { FormEvent } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { FaStar, FaClock } from 'react-icons/fa';
import avatarPlaceholder from '../assets/images/avatar/default_avatar.jpg';
import { useReviewInteractions } from '../utils/useReviewInteractions';

interface ReviewFeedItem {
  reviewId: string;
  movieId: string;
  review: string;
  rating: number;
  createdAt: string;
  user: { id: string; name: string; avatarUrl?: string };
}

interface EnrichedReview extends ReviewFeedItem {
  _id: string;
  movie: { title: string; poster_path: string };
}

export function FeedReviewCard({ review }: { review: EnrichedReview }) {
  const reviewId = review.reviewId;
  const {
    likes,
    hasLiked,
    comments,
    loading: interactionLoading,
    toggleLike,
    addComment
  } = useReviewInteractions(reviewId);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector<HTMLTextAreaElement>(
      'textarea[name="comment"]'
    );
    if (!input) return;
    addComment(input.value);
    e.currentTarget.reset();
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-4">
      <img
        src={
          review.movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${review.movie.poster_path}`
            : avatarPlaceholder
        }
        alt={review.movie.title}
        className="w-32 h-48 rounded-lg object-cover"
      />

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">
              {review.movie.title}
            </h2>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <FaClock /> {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={review.user.avatarUrl || avatarPlaceholder}
              alt={review.user.name}
              className="w-10 h-10 rounded-full"
            />
            <p className="text-white font-semibold">{review.user.name}</p>
          </div>
        </div>

        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={
                i < review.rating ? 'text-yellow-400' : 'text-gray-600'
              }
            />
          ))}
          <span className="ml-2 text-gray-400">{review.rating}/5</span>
        </div>

        <p className="text-gray-200 mt-4 flex-1">{review.review}</p>

        <div className="mt-4 pt-4 border-t border-gray-700">
          {interactionLoading ? (
            <BallTriangle width={30} height={30} />
          ) : (
            <div className="flex items-center gap-6 text-gray-500">
              <button
                onClick={toggleLike}
                className={hasLiked ? 'text-green-400' : ''}
              >
                Like ({likes})
              </button>
              <button>Comment ({comments.length})</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              name="comment"
              rows={2}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="Write a comment..."
              required
            />
            <button
              type="submit"
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Send
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {comments.map((c, index) => (
              <div key={index} className="p-2 bg-gray-800 rounded">
                <p className="text-sm text-gray-400">{c.user_id.name}</p>
                <p className="text-white">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
