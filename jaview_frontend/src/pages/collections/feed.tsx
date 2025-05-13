import { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { FeedReviewCard } from '../../components/feedReviewCard';

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

const API_BACKEND = import.meta.env.VITE_BACKEND;
const TMDB_BASE_URL = import.meta.env.VITE_URL;
const TMDB_API_KEY = import.meta.env.VITE_API_KEY;

export default function Feed() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/error', { state: { message: 'You must be logged in!' } });
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BACKEND}movies/feed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const { reviews: feedData }: { reviews: ReviewFeedItem[] } =
          await res.json();
        const enriched = await Promise.all(
          feedData.map(async (rev) => {
            const movieRes = await fetch(
              `${TMDB_BASE_URL}${rev.movieId}?api_key=${TMDB_API_KEY}`
            );
            const movie = movieRes.ok
              ? await movieRes.json()
              : { title: 'Unknown', poster_path: '' };
            return {
              ...rev,
              _id: rev.reviewId,
              movie
            };
          })
        );
        setReviews(enriched);
      } catch {
        navigate('/error', { state: { message: 'Failed to load feed.' } });
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BallTriangle />
      </div>
    );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl text-center font-bold text-slate-200 mb-6">
        Your Friends Reviews
      </h1>
      {reviews.map((review) => (
        <FeedReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
}
