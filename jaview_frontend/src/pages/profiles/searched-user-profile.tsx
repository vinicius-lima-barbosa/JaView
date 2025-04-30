import { useLocation, useNavigate } from 'react-router-dom';
import { Review } from '../../types/review-type';
import avatar from '../../assets/images/avatar/default_avatar.jpg';
import { useEffect, useState } from 'react';
const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function SearchedUserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;
  const [friendshipRequestsIds, setFriendshipRequestsIds] = useState<string[]>(
    []
  );
  const [buttonText, setButtonText] = useState('Add Friend');

  useEffect(() => {
    if (friendshipRequestsIds.includes(user._id)) {
      setButtonText('Requested');
    }
  }, [friendshipRequestsIds]);

  useEffect(() => {
    const fetchFriendshipRequests = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/error', { state: { message: 'You must be logged in!' } });
          return;
        }

        setButtonText('Loading...');

        const response = await fetch(
          `${API_BACKEND}friendships/friends-requests-sent`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        const requestsIds = data.friendships.map((f: any) => f.friend_id._id);

        setFriendshipRequestsIds(requestsIds);

        setButtonText('Add Friend');
      } catch (error) {
        console.log(error);
        navigate('/error', { state: { message: 'An error occurred!' } });
      }
    };

    fetchFriendshipRequests();
  }, [navigate]);

  const handleRequestFriendship = async (friendId: string) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/error', { state: { message: 'You must be logged in!' } });
        return;
      }

      if (friendshipRequestsIds.includes(user._id)) return;

      setButtonText('Requesting...');
      const response = await fetch(`${API_BACKEND}friendships/send-request`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ friendId }),
        method: 'POST'
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setButtonText('Requested');
      } else {
        navigate('/error', {
          state: { message: data.message }
        });
      }
    } catch (error) {
      console.log(error);
      navigate('/error', {
        state: { message: 'Error requesting friendship!' }
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-100">
        Profile
      </h1>
      <div className="flex items-center bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex-shrink-0 flex flex-col gap-6">
          <img
            src={user.avatar_url ?? avatar}
            alt="avatar"
            className="rounded-full w-28 h-28 object-cover border-4 border-slate-700"
          />
          <button
            disabled={friendshipRequestsIds.includes(user._id)}
            onClick={() => handleRequestFriendship(user._id)}
            className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-900 transition-colors"
          >
            {buttonText}
          </button>
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
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-100">
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
                  Reviewed on:{' '}
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
