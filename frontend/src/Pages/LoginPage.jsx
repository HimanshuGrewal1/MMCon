// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear error when user starts typing
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log("Login successful:", data);
//         // Store token or user data if needed
//         if (data.token) {
//           localStorage.setItem("token", data.token);
//         }
//         navigate("/dashboard"); // Redirect to dashboard or home page
//       } else {
//         setError(data.message || "Login failed. Please check your credentials.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center"
//       style={{
//         background: "linear-gradient(135deg, #667eea, #764ba2, #ff6a00)",
//         backgroundSize: "400% 400%",
//         animation: "gradientBG 15s ease infinite",
//       }}
//     >
//       <style>
//         {`
//           @keyframes gradientBG {
//             0% {background-position: 0% 50%;}
//             50% {background-position: 100% 50%;}
//             100% {background-position: 0% 50%;}
//           }
//         `}
//       </style>

//       <div className="bg-white bg-opacity-95 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
//         <h2 className="text-4xl font-bold text-center text-gradient bg-clip-text text-transparent"
//           style={{
//             backgroundImage: "linear-gradient(90deg, #ff6a00, #ffb347)",
//           }}
//         >
//           Welcome Back
//         </h2>

//         <p className="text-center text-gray-600 mt-4 mb-8">
//           Sign in to your account to continue
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg border border-red-200">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block mb-2 text-indigo-700 font-medium">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition duration-200"
//               placeholder="example@email.com"
//               required
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="text-indigo-700 font-medium">Password</label>
//               <Link 
//                 to="/forgot-password" 
//                 className="text-sm text-pink-500 hover:underline font-medium"
//               >
//                 Forgot Password?
//               </Link>
//             </div>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition duration-200"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="remember"
//               className="w-4 h-4 text-indigo-600 bg-indigo-50 border-indigo-300 rounded focus:ring-indigo-500"
//             />
//             <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
//               Remember me for 30 days
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
//                 Signing In...
//               </div>
//             ) : (
//               "Sign In"
//             )}
//           </button>

//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <button
//               type="button"
//               className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Google
//             </button>
//             <button
//               type="button"
//               className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center"
//             >
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//               </svg>
//               Twitter
//             </button>
//           </div>
//         </form>

//         <p className="mt-8 text-center text-gray-700">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-pink-500 font-semibold hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-6">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.15)] border border-[#1f1f1f] mt-10">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Sign in to your account
        </p>

        {error && (
          <div className="text-red-400 text-center font-medium bg-red-950 py-2 rounded-lg border border-red-800 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-green-400 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2f2f2f] focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-green-400 font-medium">Password</label>
              <Link
                to="/forgot-password"
                className="text-sm text-green-300 hover:text-green-400"
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
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2f2f2f] focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-green-500 bg-[#111] border-[#333] rounded focus:ring-green-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-semibold text-black bg-green-400 hover:bg-green-500 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#111] text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="py-3 rounded-lg border border-gray-700 bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
               </svg>
            Google
          </button>

          <button className="py-3 rounded-lg border border-gray-700 bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition">
           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
               <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
               </svg>
            Twitter
          </button>
        </div>

        <p className="mt-8 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
