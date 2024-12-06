import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { VERIFY_OTP_API_END_POINT } from "../../utils/constant";
// import { ToastContainer } from 'react-toastify';
import { toast } from "sonner";
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [otp, setOtp] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const location = useLocation(); 
  const email = location.state?.email || ""; 
  const navigate = useNavigate(); 

  // console.log(email)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${VERIFY_OTP_API_END_POINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }), 
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to reset password.");
      }

      const data = await response.json();
      toast.success(data.message || "Your password has been reset successfully.");
      setOtp("");
      setNewPassword("");

      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 py-8" style={{
      background: 'linear-gradient(to bottom, #6F738D 0%, #A49B79 100%)',
      backgroundSize: '100% 100%'
    }}>
      <div className="bg-white p-8 w-96 shadow-md rounded-md">
        <h2 className="text-4xl font-medium text-justify mb-2 text-gray-700 md:w-[392px] md:h-[41px]" style={{ fontFamily: 'Inter' }}>
          Set new password
        </h2>
        <p className="text-black text-md mb-4 text-start" style={{ fontFamily: 'Inter' }}>
          Your new password must be different from{" "}
          <span className="text-center" style={{ fontFamily: 'Inter' }}>previously used passwords</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Please enter the OTP that was sent to your email
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  md:w-[300px]"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="mt-1 p-2 w-full border border-gray-400 rounded-lg md:w-[300px]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-[300px]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-customBlue text-white rounded-lg font-semibold md:w-[300px]"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="flex items-center justify-center text-gray-700 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 10h9a1 1 0 110 2h-9.586l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
      {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
    </div>
  );
};

export default ResetPassword;
