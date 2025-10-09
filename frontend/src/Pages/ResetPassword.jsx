import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError(true);
      setMessage("Please enter a valid email address.");
      return;
    }

    setError(false);
    setMessage("A reset link has been sent to your email.");

    console.log("Reset password request for:", email);

    setTimeout(() => {
      setMessage("If the email exists in our system, a reset link has been sent.");
    }, 1500);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.02 }}
          >
            <label className="block mb-2 text-gray-700 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition duration-300"
              placeholder="example@email.com"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Reset Link
          </motion.button>
        </form>

        {message && (
          <motion.p
            className={`mt-4 text-center ${error ? "text-red-500" : "text-green-600"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Remembered your password?{" "}
          <Link to="/" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
