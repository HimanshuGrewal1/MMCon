// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetch("http://localhost:5000/api/auth/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         	navigate("/verify-email");
        
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-cente bg-darkbg"
      
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
//           Create Your Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5 mt-6">
//           <div>
//             <label className="block mb-2 text-indigo-700 font-medium">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
//               placeholder="John Doe"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-indigo-700 font-medium">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
//               placeholder="example@email.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-indigo-700 font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
//               placeholder="Enter password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 transition duration-300"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-700">
//           Already have an account?{" "}
//           <Link to="/login" className="text-pink-500 font-semibold hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetch("http://localhost:5000/api/auth/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         navigate("/verify-email");
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
//       <div className="bg-black/90 border border-green-600 rounded-3xl p-10 shadow-[0_0_25px_rgba(0,255,100,0.3)] w-full max-w-md">
//         <h2 className="text-4xl font-extrabold text-center mb-8">
//           <span className="text-green-500">Create</span> Your Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block mb-2 text-green-400 font-semibold">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-transparent border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-400"
//               placeholder="John Doe"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-green-400 font-semibold">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-transparent border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-400"
//               placeholder="example@email.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-green-400 font-semibold">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-transparent border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-400"
//               placeholder="Enter password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg font-bold bg-green-600 text-black hover:bg-green-500 transition duration-300 shadow-[0_0_15px_rgba(0,255,100,0.5)]"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-300">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-green-400 font-semibold hover:underline"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        navigate("/verify-email");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#eef1f4] to-[#e6eaef] text-[#1a1a1a]">
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)]">
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] text-transparent bg-clip-text">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] hover:opacity-90 transition-all duration-300 shadow-[0_4px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.4)]"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#0ea5e9] hover:underline hover:text-[#0891b2] transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
