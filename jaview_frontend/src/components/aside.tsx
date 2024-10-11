export default function Aside() {
  return (
    <>
      <aside className="w-1/5 bg-gray-800 p-4 min-h-screen">
        <div className="flex items-center mb-8">
          <img
            src="https://placehold.co/50x50"
            alt="avatar"
            className="rounded-full mr-4"
          />
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
                Login
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
