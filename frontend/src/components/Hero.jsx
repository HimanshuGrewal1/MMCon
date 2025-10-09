import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Transform PDFs into Interactive Mind Maps
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            Instantly convert academic or professional PDFs into beautiful mind maps for quick revision and deep understanding.
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              to="#features"
              className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-indigo-600 transition"
            >
              Learn More
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
            src="https://i.ibb.co/pbQYYzG/mindmap-illustration.png"
            alt="Mind Map Illustration"
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
