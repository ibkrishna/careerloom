import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FORGOT_PASSWORD_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setError("");
  
    try {
      const response = await fetch(FORGOT_PASSWORD_API_END_POINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset instructions.");
      }
  
      const data = await response.json();
      setMessage(data.message || "A password reset link has been sent to your email.");
      setEmail("");
      navigate("/resetpassword", { state: { email } });
      toast.success("Password reset instructions sent to your email.");
    } catch (err) {
      toast.error(err.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 py-8"  style={{
      background: 'linear-gradient(to bottom, #6F738D 0%, #A49B79 100%)',
      backgroundSize: '100% 100%'
    }}>
      <div className="bg-white p-8 w-96 shadow-md rounded-md">
        <h2 className="text-3xl font-medium mb-2 text-[#4A4E69] md:w-[392px] md:h-[41px] text-justify" style={{ fontFamily: 'Inter' }}>
          Forgot Password
        </h2>
        <p className="text-[#4A4E69] text-md mb-2" style={{ fontFamily: 'Inter' }}>
          No worries, we'll send you reset instructions
        </p>
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#4A4E69]"
              style={{ fontFamily: 'Inter' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-[300px]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-[#4A4E69] text-white rounded-lg font-semibold md:w-[300px]"
            style={{ fontFamily: 'Inter' }}
          >
            Request OTP
          </button>
        </form>
        <div className="mt-4 text-center text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>
          <Link
            to="/login"
            className="flex items-center justify-center text-gray-700 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 10h9a1 1 0 110 2h-9.586l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
