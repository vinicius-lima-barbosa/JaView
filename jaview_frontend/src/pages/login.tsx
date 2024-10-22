import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BACKEND = import.meta.env.VITE_BACKEND;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BACKEND}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataTest = await response.json();

      if (response.ok) {
        localStorage.setItem("token", dataTest.token);

        navigate("/");
        window.location.reload();
      } else {
        setError(dataTest.message || "Login failed!");
      }
    } catch (err) {
      setError(`Something went wrong! ${err}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500  text-black"
              placeholder="Type your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500  text-black"
              placeholder="Type your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300"
          >
            Log in
          </button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <p>Don't have an account?</p>
          <Link to={"/register"} className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
