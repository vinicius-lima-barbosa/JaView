import { useEffect, useState } from 'react';
import { FaClock, FaEnvelope, FaTrash, FaUser } from 'react-icons/fa';
import { BallTriangle } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
const API_BACKEND = import.meta.env.VITE_BACKEND;
import avatar from '../../assets/images/avatar/default_avatar.jpg';
import { formatFriendshipDuration } from '../../utils/formatFriendshipDate';

type Friendships = {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
  friend_id: {
    _id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
};

type FriendsResponse = {
  friendships: Friendships[];
  userId: string;
};

export default function UserReviews() {
  const [friendships, setFriendships] = useState<Friendships[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/error', { state: { message: 'You must be logged in!' } });
          return;
        }

        const response = await fetch(`${API_BACKEND}friendships/friends`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data: FriendsResponse = await response.json();

        setFriendships(data.friendships);
        setLoading(false);
        setUserId(data.userId);
      } catch {
        navigate('/error', { state: { message: 'An error occurred!' } });
      }
    };

    fetchFriends();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BallTriangle />
      </div>
    );
  }

  const handleDeleteFriendship = async (friendshipId: string) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/error', { state: { message: 'You must be logged in!' } });
        return;
      }

      const response = await fetch(
        `${API_BACKEND}friendships/${friendshipId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          method: 'DELETE'
        }
      );

      if (response.ok) {
        setFriendships(friendships.filter((f) => f._id !== friendshipId));
      } else {
        navigate('/error', {
          state: { message: 'Failed to delete the friend.' }
        });
      }
    } catch {
      navigate('/error', { state: { message: 'Error deleting friend!' } });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-200">
        Your Friends
      </h1>
      {friendships.length === 0 ? (
        <p className="text-center text-gray-500">You haven`t friends.</p>
      ) : (
        <ul className="space-y-6">
          {friendships.map((friendship) => {
            const { friend_id, user_id } = friendship;
            const friend =
              friendship.friend_id._id === userId ? user_id : friend_id;

            return (
              <div
                key={friendship._id}
                className="rounded-lg border bg-slate-900 shadow-sm overflow-hidden transition-all hover:shadow-md relative"
              >
                <button
                  onClick={() => handleDeleteFriendship(friendship._id)}
                  className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-800 transition-colors group"
                  aria-label="Delete friend"
                >
                  <FaTrash className="h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                </button>
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <img
                      src={friend.avatar_url ?? avatar}
                      alt="avatar"
                      className="rounded-full w-24 h-24 object-cover border-2 border-slate-300"
                    />

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-slate-2" />
                        <h3 className="font-bold text-xl">{friend.name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaEnvelope className="h-4 w-4 text-slate-2" />
                        <a
                          href={`mailto:${friend.email}`}
                          className="text-sm text-slate-200 hover:text-slate-400"
                        >
                          {friend.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4 text-slate-2" />
                        <span className="text-xs text-slate-200">
                          Amigos há{' '}
                          {formatFriendshipDuration(friendship.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
