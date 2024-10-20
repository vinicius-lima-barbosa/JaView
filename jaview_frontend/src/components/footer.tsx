import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import logoTmdb from "../assets/images/logos/logoLongoTMDB.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
        <div className="flex items-center space-x-4">
          <img src={logoTmdb} alt="TMDB Logo" className="w-44" />
          <p className="text-sm">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-6 md:mt-0">
          <a href="/about" className="hover:text-green-400">
            About Us
          </a>
          <a href="/contact" className="hover:text-green-400">
            Contact
          </a>
          <a href="/privacy" className="hover:text-green-400">
            Privacy Policy
          </a>
        </div>

        <div className="flex space-x-4 mt-6 md:mt-0">
          <a
            target="_blank"
            href="https://facebook.com"
            className="hover:text-green-400"
          >
            <FaFacebookF />
          </a>
          <a
            target="_blank"
            href="https://twitter.com"
            className="hover:text-green-400"
          >
            <FaTwitter />
          </a>
          <a
            target="_blank"
            href="https://instagram.com"
            className="hover:text-green-400"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

      <div className="container mx-auto mt-6 text-center">
        <p>
          Contact us:{" "}
          <a
            href="mailto:support@jaview.com"
            className="text-green-400 hover:underline"
          >
            support@jaview.com
          </a>
        </p>
        <p>Phone: +1 (800) 123-4567</p>
      </div>

      <div className="text-center mt-4 text-sm">
        <p>&copy; 2024 JaView. All rights reserved.</p>
      </div>
    </footer>
  );
}
