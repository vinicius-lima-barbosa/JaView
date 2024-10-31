import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/images/avatar/default_avatar.jpg";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

const API_BACKEND = import.meta.env.VITE_BACKEND;

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
  });
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setBio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/error", {
        state: { message: "You must be logged in!" },
      });
      return;
    }

    const fetchProfile = async () => {
      const response = await fetch(`${API_BACKEND}user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setNewName(data.name);
      setBio(data.bio);
    };

    fetchProfile();
  }, [navigate]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BACKEND}user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, bio: newBio }),
      });

      if (!response.ok) {
        navigate("/error", {
          state: { message: "User already exists!" },
        });
      }

      const data = await response.json();
      setProfile(data);
      setEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      navigate("/error", {
        state: { message: "An error occurred while updating your profile!" },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {profile.name}'s Profile
      </h1>
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-2xl">
        {!editing ? (
          <div className="flex flex-col">
            <div className="flex justify-center items-center mb-5">
              <img
                src={avatar}
                alt="avatar"
                className="rounded-full mr-4 w-28 h-28 object-cover border-2 border-white "
              />
            </div>
            <div>
              <div className="flex flex-col mb-3">
                <label className="text-sm ml-1 text-slate-200">Name:</label>
                <div className="mb-4 bg-slate-700 rounded-lg p-2">
                  <p className="text-lg">{profile.name}</p>
                </div>
                <label className="text-sm ml-1 text-slate-200">Email:</label>
                <div className="mb-4 bg-slate-700 rounded-lg p-2">
                  <p className="text-lg">{profile.email}</p>
                </div>
                {profile.bio && (
                  <>
                    <label className="text-sm ml-1 text-slate-200">Bio:</label>
                    <div className="mb-4 bg-slate-700 rounded-lg p-2">
                      <p className="text-lg">{profile.bio}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-evenly items-center">
              <button
                className="bg-green-500 hover:bg-green-700 transition-all duration-200 text-white px-4 py-2 rounded"
                onClick={toggleEdit}
              >
                Edit Profile
              </button>
              <Link
                className="bg-green-500 hover:bg-green-700 transition-all duration-200 text-white px-4 py-2 rounded"
                to={"/user/reviews"}
              >
                View your reviews
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-slate-200">Name:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-200">Bio:</label>
              <input
                type="text"
                value={newBio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
              />
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={updateProfile}
            >
              Save Changes
            </button>
            <button
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={toggleEdit}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
