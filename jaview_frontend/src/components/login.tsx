import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataTest = await response.json();
      console.log(dataTest);

      if (response.ok) {
        localStorage.setItem("token", dataTest.token);
        alert("Login successful!");
      } else {
        setError(dataTest.message || "Login failed!");
      }
    } catch (err) {
      setError(`Something went wrong! ${err}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h2>
        {error && <p className="text-red-400 pb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-black"
              placeholder="Type the email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-black"
              placeholder="Type the password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
          >
            Log in
          </button>
        </form>
        <div className="text-slate-900 flex justify-between items-center mt-2">
          <p>Not have a account?</p>
          <Link to={"/register"} className="text-blue-900">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
