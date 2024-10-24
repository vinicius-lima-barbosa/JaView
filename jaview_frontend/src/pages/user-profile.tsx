import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
}

const API_BACKEND = import.meta.env.VITE_BACKEND;

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`${API_BACKEND}user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setNewName(data.name);
    };

    fetchProfile();
  }, []);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const updateProfile = async () => {
    try {
      const response = await fetch(`${API_BACKEND}user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data);
      setEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {profile.name}'s Profile
      </h1>
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-2xl">
        {!editing ? (
          <>
            <div className="flex justify-between mb-3">
              <div className="mb-4">
                <label className="block text-slate-200">Name:</label>
                <p className="text-xl">{profile.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-slate-200">Email:</label>
                <p className="text-xl">{profile.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
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
          </>
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
