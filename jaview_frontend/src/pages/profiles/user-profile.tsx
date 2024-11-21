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
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

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
      try {
        const response = await fetch(`${API_BACKEND}user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile.");
        }

        const data = await response.json();
        setProfile(data);
        setNewName(data.name);
        setBio(data.bio);
      } catch (error) {
        setMessage("An error occurred while fetching your profile.");
        setType("error");
        console.log(error);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditing(false);

        setMessage("Profile updated successfully!");
        setType("success");
      } else {
        setMessage("User already exists!");
        setType("error");
      }
    } catch (error) {
      setMessage("An error occurred while updating your profile.");
      setType("error");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      {message && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md text-center transition duration-500 ${
            type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {message}
        </div>
      )}

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
                <label className="text-sm ml-1 font-bold text-slate-200">
                  Name:
                </label>
                <div className="mb-4 bg-slate-700 rounded-lg p-2">
                  <p className="text-lg">{profile.name}</p>
                </div>
                <label className="text-sm ml-1 font-bold text-slate-200">
                  Email:
                </label>
                <div className="mb-4 bg-slate-700 rounded-lg shadow-md p-2">
                  <p className="text-lg">{profile.email}</p>
                </div>
                {profile.bio && (
                  <>
                    <label className="text-sm ml-1 font-bold text-slate-200">
                      Bio:
                    </label>
                    <div className="mb-4 bg-slate-700 rounded-lg shadow-md p-2">
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
                placeholder="Enter your name..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-200">Bio:</label>
              <textarea
                value={newBio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
                placeholder="Tell us about yourself..."
              />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 transition-all duration-200 text-white px-4 py-2 rounded"
              onClick={updateProfile}
            >
              Save Changes
            </button>
            <button
              className="ml-2 bg-gray-500 hover:bg-gray-600 transition-all duration-200 text-white px-4 py-2 rounded"
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
