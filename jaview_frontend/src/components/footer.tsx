import logoTmdb from "../assets/images/logos/logoLongoTMDB.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 text-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-evenly items-center">
        <div className="flex items-center space-x-4">
          <img src={logoTmdb} alt="TMDB Logo" className="w-44" />
          <p className="text-sm">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>

        <p>
          Contact us:{" "}
          <a className="text-green-400 hover:underline">
            viniciusbarbosa0202@gmail.com
          </a>
        </p>
      </div>

      <div className="text-center mt-4 text-sm">
        <p>&copy; 2024 JaView. All rights reserved.</p>
      </div>
    </footer>
  );
}
