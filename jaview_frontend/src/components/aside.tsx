import avatar from "../../public/images/default_avatar.jpg";

export default function Aside() {
  return (
    <>
      <aside className="w-1/5 bg-gray-800 p-4 min-h-screen">
        <div className="flex items-center m-2 mb-8">
          <img src={avatar} alt="avatar" className="rounded-full mr-4 w-14" />
          <span>Hi, user</span>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                My reviews
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Most rated movies
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Login
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
