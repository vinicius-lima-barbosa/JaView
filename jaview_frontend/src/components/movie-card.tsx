import { FaStar } from "react-icons/fa";

export default function MovieCard() {
  return (
    <div className=" w-60 relative flex-col">
      <img src="" alt="" className="w-full rounded-lg" />
      <h2 className="mt-2">title</h2>
      <p className="text-gray-400">genre</p>
      <div className="absolute bottom-2 right-2 bg-orange-500 text-white rounded-full px-2 py-1">
        <FaStar />
      </div>
    </div>
  );
}
