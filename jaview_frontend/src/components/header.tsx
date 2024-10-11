import { IoIosSearch } from "react-icons/io";

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">JaView</h1>
      <button className="bg-green-500 p-3 rounded-full">
        <i className="text-white text-2xl">
          <IoIosSearch />
        </i>
      </button>
    </header>
  );
}
