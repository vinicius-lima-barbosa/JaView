import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatarPlaceholder from '../../assets/images/avatar/default_avatar.jpg';
import { CiEdit } from 'react-icons/ci';

interface UserProfileData {
  name: string;
  email: string;
  bio: string;
  avatar_url?: string;
}

const API_BACKEND = import.meta.env.VITE_BACKEND;

type Message = { text: string; type: 'success' | 'error' } | null;

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    email: '',
    bio: ''
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.avatar_url || avatarPlaceholder
  );
  const [message, setMessage] = useState<Message>(null);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error', { state: { message: 'You must be logged in!' } });
      return;
    }

    try {
      const res = await fetch(`${API_BACKEND}user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data: UserProfileData = await res.json();
      setProfile(data);
      setFormData({ name: data.name, bio: data.bio });
      setAvatarPreview(data.avatar_url || avatarPlaceholder);
    } catch {
      setMessage({ text: 'Error loading profile.', type: 'error' });
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setAvatarFile(file);
      if (file) setAvatarPreview(URL.createObjectURL(file));
    },
    []
  );

  const saveProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const form = new FormData();
    form.append('name', formData.name);
    form.append('bio', formData.bio);
    if (avatarFile) form.append('avatar', avatarFile);

    try {
      const res = await fetch(`${API_BACKEND}user/update-profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProfile(updated);
      setEditing(false);
      setMessage({ text: 'Profile saved!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to save profile.', type: 'error' });
    }
  }, [formData, avatarFile]);

  return (
    <div className="flex justify-center items-start py-12 min-h-screen">
      <div className="w-full max-w-3xl shadow-xl bg-gray-900 rounded-2xl p-8 space-y-6">
        {message && (
          <div
            className={`px-4 py-2 rounded-lg text-center border ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar Section */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="relative inline-block">
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
              {editing && (
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <CiEdit className="text-green-700" />
                </label>
              )}
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-200">
                {editing ? 'Edit Profile' : `${profile.name}'s Profile`}
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Name
                </label>
                {!editing ? (
                  <p className="mt-1 text-gray-200">{profile.name}</p>
                ) : (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Your name"
                  />
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Email
                </label>
                <p className="mt-1 text-gray-200">{profile.email}</p>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Bio
                </label>
                {!editing ? (
                  <p className="mt-1 text-gray-200 whitespace-pre-wrap">
                    {profile.bio || 'No bio provided.'}
                  </p>
                ) : (
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block p-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Tell us about yourself"
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              {editing ? (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={!formData.name.trim()}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <Link
                  to="/user/reviews"
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  My Reviews
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
