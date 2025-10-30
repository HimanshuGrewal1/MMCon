import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-darkbg text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-10">
            Transform PDFs into <p className="text-green-400 inline-block">
              Interactive Mind Maps
              </p>
          </h1>
          <hr className="border-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400 my-6 rounded-full" />

          <p className="text-lg md:text-xl text-gray-100">
            Instantly convert academic or professional PDFs into beautiful mind maps for quick revision and deep understanding.
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              Get Started
            </Link>


          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <img
            src="./mindmap.png"
            alt="Mind Map Illustration"
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
