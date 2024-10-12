import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-8">
      <h1
        className="text-4xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        JaView
      </h1>
      <button className="bg-green-500 p-3 rounded-full">
        <i className="text-white text-2xl">
          <IoIosSearch />
        </i>
      </button>
    </header>
  );
}
