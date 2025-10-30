import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-indigo-600 hover:text-indigo-500 transition-all duration-300"
        >
          MindMap
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link className="group relative text-gray-700 font-medium hover:text-indigo-500 transition"
            to="/home"
          >
            Home
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-indigo-500"></span>
          </Link>

          <Link
            to="/signup"
            className="group relative text-gray-700 font-medium hover:text-indigo-500 transition"
          >
            Signup
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-indigo-500"></span>
          </Link>

          <Link
            to="/reset-password"
            className="group relative text-gray-700 font-medium hover:text-indigo-500 transition"
          >
            Reset Password
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-indigo-500"></span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button className="text-gray-700 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
