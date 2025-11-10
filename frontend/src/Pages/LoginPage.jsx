import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js";
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      // If login is successful, the auth store will handle the redirect
    } catch (error) {
      // Check if it's a 400 error or invalid credentials
      if (error.response?.status === 400 || error.response?.data?.message?.includes('credentials')) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.response?.data?.message || 'Invalid email or password. Please try again.',
          confirmButtonColor: '#06b6d4',
          confirmButtonText: 'Try Again'
        });
      } else {
        // For other errors, show a generic error message
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Login Error',
        //   text: 'An unexpected error occurred. Please try again.',
        //   confirmButtonColor: '#06b6d4',
        //   confirmButtonText: 'OK'
        // });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f2f3f5] to-[#e8ebee] text-gray-900">
      {/* subtle background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,220,240,0.25),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(200,220,230,0.2),transparent_70%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md p-10 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-700 font-medium">Password</label>
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-600 hover:text-cyan-800 transition"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-400"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-500">
              Remember me for 30 days
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-[0_0_15px_rgba(0,150,200,0.2)] hover:shadow-[0_0_25px_rgba(0,150,200,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/70 backdrop-blur-lg text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition text-gray-700">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <button className="py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
            Twitter
          </button>
        </div>

        <p className="mt-8 text-center text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-600 font-semibold hover:text-cyan-700 transition"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </section>
  );
}