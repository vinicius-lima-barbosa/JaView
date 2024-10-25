import { Link, useLocation } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();
  const message = location.state?.message || "An unexpected error occurred.";

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-gray-900 shadow-2xl rounded-lg p-10 text-center">
        <h1 className="text-5xl font-extrabold text-red-500 mb-4">Error</h1>
        <p className="text-xl text-slate-100 mb-8">{message}</p>
        <Link
          to="/"
          className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300 ease-in-out"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
