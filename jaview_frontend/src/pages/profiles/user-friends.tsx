import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { FaClock, FaEnvelope, FaUser, FaTrash } from 'react-icons/fa';
import { BallTriangle } from 'react-loader-spinner';
import { formatFriendshipDuration } from '../../utils/formatFriendshipDate';
import avatarPlaceholder from '../../assets/images/avatar/default_avatar.jpg';
import { useNavigate } from 'react-router-dom';

const API_BACKEND = import.meta.env.VITE_BACKEND;

type FriendshipBase = {
  _id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type RequestReceived = FriendshipBase & {
  user_id: { _id: string; name: string; email: string; avatar_url?: string };
  friend_id: string;
};

type RequestSent = FriendshipBase & {
  friend_id: { _id: string; name: string; email: string; avatar_url?: string };
  user_id: string;
};

type Friend = FriendshipBase & {
  user_id: { _id: string; name: string; email: string; avatar_url?: string };
  friend_id: { _id: string; name: string; email: string; avatar_url?: string };
};

type Tab = 'received' | 'sent' | 'friends';

type CardProps = {
  avatar?: string;
  name: string;
  email: string;
  date: string;
  actions?: ReactNode;
};

export default function UserSocial() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [requestsReceived, setRequestsReceived] = useState<RequestReceived[]>(
    []
  );
  const [requestsSent, setRequestsSent] = useState<RequestSent[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('received');

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error', { state: { message: 'You must be logged in!' } });
      return;
    }
    try {
      const [recvRes, sentRes, friendsRes] = await Promise.all([
        fetch(`${API_BACKEND}friendships/friends-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BACKEND}friendships/friends-requests-sent`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BACKEND}friendships/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const recvData: { friendships: RequestReceived[] } = await recvRes.json();
      const sentData: { friendships: RequestSent[] } = await sentRes.json();
      const friendsData: { friendships: Friend[]; userId: string } =
        await friendsRes.json();

      setRequestsReceived(recvData.friendships);
      setRequestsSent(sentData.friendships);
      setFriends(friendsData.friendships);
      setUserId(friendsData.userId);
    } catch {
      navigate('/error', { state: { message: 'Error fetching social data.' } });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateLocal = <T extends FriendshipBase>(
    list: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string
  ) => setter(list.filter((item) => item._id !== id));

  const handleAction = async <T extends FriendshipBase>(
    id: string,
    action: 'accept' | 'reject' | 'delete',
    list: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error', { state: { message: 'You must be logged in!' } });
      return;
    }
    try {
      const method =
        action === 'reject' || action === 'delete' ? 'DELETE' : 'PUT';
      const url = `${API_BACKEND}friendships/${id}/${action}`;
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) updateLocal(list, setter, id);
      else {
        const err = await res.json();
        navigate('/error', { state: { message: err.message } });
      }
    } catch {
      navigate('/error', { state: { message: `Error on ${action} action.` } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BallTriangle />
      </div>
    );
  }

  const Card = ({ avatar, name, email, date, actions }: CardProps) => (
    <div className="rounded-lg border bg-slate-900 shadow-sm p-4 relative hover:shadow-md transition">
      {actions}
      <div className="flex items-center gap-4">
        <img
          src={avatar || avatarPlaceholder}
          alt={name}
          className="w-24 h-24 rounded-full border-2 border-slate-300 object-cover"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-slate-200">
            <FaUser />
            <h3 className="font-bold text-xl">{name}</h3>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <FaEnvelope />
            <a
              href={`mailto:${email}`}
              className="text-sm hover:text-slate-400"
            >
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <FaClock />
            <span className="text-xs">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequestsReceived = () => {
    if (!requestsReceived.length)
      return <p className="text-center text-gray-500">No incoming requests.</p>;
    return requestsReceived.map((r) => (
      <Card
        key={r._id}
        avatar={r.user_id.avatar_url}
        name={r.user_id.name}
        email={r.user_id.email}
        date={`Received ${formatFriendshipDuration(r.created_at)}`}
        actions={
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() =>
                handleAction(
                  r._id,
                  'accept',
                  requestsReceived,
                  setRequestsReceived
                )
              }
              className="px-3 py-1 bg-green-700 rounded hover:bg-green-800"
            >
              Accept
            </button>
            <button
              onClick={() =>
                handleAction(
                  r._id,
                  'reject',
                  requestsReceived,
                  setRequestsReceived
                )
              }
              className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
            >
              Reject
            </button>
          </div>
        }
      />
    ));
  };

  const renderRequestsSent = () => {
    if (!requestsSent.length)
      return <p className="text-center text-gray-500">No sent requests.</p>;
    return requestsSent.map((r) => (
      <Card
        key={r._id}
        avatar={r.friend_id.avatar_url}
        name={r.friend_id.name}
        email={r.friend_id.email}
        date={`Sent ${formatFriendshipDuration(r.created_at)}`}
        actions={
          <button
            onClick={() =>
              handleAction(r._id, 'delete', requestsSent, setRequestsSent)
            }
            className="absolute top-2 right-2 px-3 py-1 bg-red-700 rounded hover:bg-red-800"
          >
            Cancel
          </button>
        }
      />
    ));
  };

  const renderFriends = () => {
    if (!friends.length)
      return <p className="text-center text-gray-500">No friends yet.</p>;
    return friends.map((f) => {
      const user = f.friend_id._id === userId ? f.user_id : f.friend_id;
      return (
        <Card
          key={f._id}
          avatar={user.avatar_url}
          name={user.name}
          email={user.email}
          date={`Friends ${formatFriendshipDuration(f.updated_at)}`}
          actions={
            <button
              onClick={() => handleAction(f._id, 'delete', friends, setFriends)}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-slate-800"
            >
              <FaTrash className="text-slate-400 hover:text-red-500" />
            </button>
          }
        />
      );
    });
  };

  const renderList = () => {
    switch (activeTab) {
      case 'sent':
        return renderRequestsSent();
      case 'friends':
        return renderFriends();
      default:
        return renderRequestsReceived();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto rounded-2xl p-6 space-y-6">
        <nav className="flex justify-center space-x-4">
          {(['received', 'friends', 'sent'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab === 'received'
                ? 'Incoming'
                : tab === 'sent'
                  ? 'Sent'
                  : 'Friends'}
            </button>
          ))}
        </nav>
        <div className="space-y-4">{renderList()}</div>
      </div>
    </div>
  );
}
