import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual forgot password API call
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Reset link sent successfully:", data);
        setIsSubmitted(true);
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff6a00)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>

      <div className="bg-white bg-opacity-95 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gradient bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #ff6a00, #ffb347)",
          }}
        >
          Forgot Password
        </h2>

        {!isSubmitted ? (
          <>
            <p className="text-center text-gray-600 mt-4 mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="relative">
                <label className="block mb-2 text-indigo-700 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 transition duration-200"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center mt-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h3>
            <p className="text-gray-600 mb-2">
              If an account exists for <span className="font-semibold text-indigo-700">{email}</span>, 
              you will receive a password reset link shortly.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Didn't receive the email?{" "}
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-pink-500 font-semibold hover:underline cursor-pointer"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link 
            to="/login" 
            className="text-pink-500 font-semibold hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;