import { useEffect, useState } from 'react';
import { FaClock, FaEnvelope, FaUser } from 'react-icons/fa';
import { BallTriangle } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
const API_BACKEND = import.meta.env.VITE_BACKEND;
import avatar from '../../assets/images/avatar/default_avatar.jpg';
import { formatFriendshipDuration } from '../../utils/formatFriendshipDate';

interface Friendship {
  _id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Request extends Friendship {
  user_id: {
    _id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
  friend_id: string;
}
interface RequestSent extends Friendship {
  friend_id: {
    _id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
  user_id: string;
}

type RequestsResponse = {
  friendships: Request[];
};
type RequestsSentResponse = {
  friendships: RequestSent[];
};

export default function UserRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [requestsSent, setRequestsSent] = useState<RequestSent[]>([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/error', { state: { message: 'You must be logged in!' } });
        return;
      }

      const requestsResponse = await fetch(
        `${API_BACKEND}friendships/friends-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const requestsData: RequestsResponse = await requestsResponse.json();

      const requestsSentResponse = await fetch(
        `${API_BACKEND}friendships/friends-requests-sent`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const requestsSentData: RequestsSentResponse =
        await requestsSentResponse.json();

      setRequests(requestsData.friendships);
      setRequestsSent(requestsSentData.friendships);

      setLoading(false);
    } catch (error) {
      navigate('/error', { state: { message: 'An error occurred!', error } });
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/error', { state: { message: 'You must be logged in!' } });
        return;
      }

      const response = await fetch(
        `${API_BACKEND}friendships/${friendshipId}/accept`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },

          method: 'PUT'
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchData();
      } else {
        navigate('/error', {
          state: { message: data.message }
        });
      }
    } catch (error) {
      navigate('/error', {
        state: { message: 'Error accepting friendship!', error }
      });
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/error', { state: { message: 'You must be logged in!' } });
        return;
      }

      const response = await fetch(
        `${API_BACKEND}friendships/${friendshipId}/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },

          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchData();
      } else {
        navigate('/error', {
          state: { message: data.message }
        });
      }
    } catch (error) {
      navigate('/error', {
        state: { message: 'Error rejecting friendship!', error }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BallTriangle />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-200">
          Your Requests
        </h1>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500">You haven`t requests.</p>
        ) : (
          <ul className="space-y-6">
            {requests.map((friendship) => {
              const { user_id } = friendship;

              return (
                <div
                  key={friendship._id}
                  className="rounded-lg border bg-slate-900 shadow-sm overflow-hidden transition-all hover:shadow-md relative"
                >
                  <button
                    onClick={() => handleAcceptRequest(friendship._id)}
                    className="px-4 py-2 absolute top-3 right-40 bg-green-700 rounded-md hover:bg-green-800 transition-colors"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleRejectRequest(friendship._id)}
                    className="px-4 py-2 absolute top-3 right-3 bg-red-700 rounded-md hover:bg-red-800 transition-colors"
                  >
                    Reject Request
                  </button>

                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <img
                        src={user_id.avatar_url ?? avatar}
                        alt="avatar"
                        className="rounded-full w-24 h-24 object-cover border-2 border-slate-300"
                      />

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <FaUser className="h-4 w-4 text-slate-2" />
                          <h3 className="font-bold text-xl">{user_id.name}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaEnvelope className="h-4 w-4 text-slate-2" />
                          <a
                            href={`mailto:${user_id.email}`}
                            className="text-sm text-slate-200 hover:text-slate-400"
                          >
                            {user_id.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaClock className="h-4 w-4 text-slate-2" />
                          <span className="text-xs text-slate-200">
                            Recebido há{' '}
                            {formatFriendshipDuration(friendship.created_at)}
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

      <div>
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-200">
          Requests You Sent
        </h1>
        {requestsSent.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven`t requests you sent.
          </p>
        ) : (
          <ul className="space-y-6">
            {requestsSent.map((friendship) => {
              const { friend_id } = friendship;

              return (
                <div
                  key={friendship._id}
                  className="rounded-lg border bg-slate-900 shadow-sm overflow-hidden transition-all hover:shadow-md relative"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <img
                        src={friend_id.avatar_url ?? avatar}
                        alt="avatar"
                        className="rounded-full w-24 h-24 object-cover border-2 border-slate-300"
                      />

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <FaUser className="h-4 w-4 text-slate-2" />
                          <h3 className="font-bold text-xl">
                            {friend_id.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaEnvelope className="h-4 w-4 text-slate-2" />
                          <a
                            href={`mailto:${friend_id.email}`}
                            className="text-sm text-slate-200 hover:text-slate-400"
                          >
                            {friend_id.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaClock className="h-4 w-4 text-slate-2" />
                          <span className="text-xs text-slate-200">
                            Solicitação enviada há{' '}
                            {formatFriendshipDuration(friendship.created_at)}
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
    </div>
  );
}
