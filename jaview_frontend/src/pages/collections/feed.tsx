import { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { FaStar, FaClock } from 'react-icons/fa';
import avatarPlaceholder from '../../assets/images/avatar/default_avatar.jpg';
import { useNavigate } from 'react-router-dom';

interface ReviewFeedItem {
  movieId: string;
  review: string;
  rating: number;
  createdAt: string;
  user: { id: string; name: string; avatarUrl?: string };
}

const API_BACKEND = import.meta.env.VITE_BACKEND;
const TMDB_BASE_URL = import.meta.env.VITE_URL;
const TMDB_API_KEY = import.meta.env.VITE_API_KEY;

interface EnrichedReview extends ReviewFeedItem {
  movie: {
    title: string;
    poster_path: string;
  };
}

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
          feedData.map(async (review) => {
            const movieRes = await fetch(
              `${TMDB_BASE_URL}${review.movieId}?api_key=${TMDB_API_KEY}`
            );
            const movie = movieRes.ok
              ? await movieRes.json()
              : { title: 'Unknown', poster_path: '' };
            return { ...review, movie };
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BallTriangle />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl text-center font-bold text-slate-200 mb-6">
        Your Friends' Reviews
      </h1>
      <div className="space-y-6">
        {reviews.map((item) => (
          <div
            key={`${item.user.id}-${item.movieId}-${item.createdAt}`}
            className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-4"
          >
            <img
              src={
                item.movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.movie.poster_path}`
                  : avatarPlaceholder
              }
              alt={item.movie.title}
              className="w-32 h-48 rounded-lg object-cover"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-200">
                    {item.movie.title}
                  </h2>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FaClock /> {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={item.user.avatarUrl || avatarPlaceholder}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-white font-semibold flex items-center gap-1">
                    {item.user.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < item.rating ? 'text-yellow-400' : 'text-gray-600'
                    }
                  />
                ))}
                <span className="ml-2 text-gray-400">{item.rating}/5</span>
              </div>
              <p className="text-gray-200 mt-4 flex-1">{item.review}</p>
              <div className="mt-4 pt-4 border-t border-gray-700 flex gap-6 text-gray-500">
                <button disabled>Like</button>
                <button disabled>Comment</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
