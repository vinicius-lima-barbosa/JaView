import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-gray-900 shadow-2xl rounded-lg p-10 text-center">
        <h1 className="text-5xl font-extrabold text-green-500 mb-4">Success</h1>
        <p className="text-xl text-slate-100 mb-8">
          Your review was submitted successfully!
        </p>
        <Link
          to="/user/reviews"
          className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300 ease-in-out"
        >
          See my reviews
        </Link>
      </div>
    </div>
  );
}
