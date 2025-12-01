import React, { useContext, useState } from 'react';
import bloging from '../assets/loginPage.jpg';
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  // FIX: Use ONLY local loading, not global context loading
  const [loading, setLoading] = useState(false);

  const { serverUrl, setUserData } = useContext(UserDataContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    setLoading(true);
    setLocalError("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login Success:", result.data);

      const userPayload = result.data.user;

      if (!userPayload) {
        throw new Error("Invalid server response: missing user object");
      }

      setUserData(userPayload);

      // Small delay to ensure cookie is stored
      setTimeout(() => navigate("/"), 50);

    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      setLocalError(message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bloging})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <form
        className="w-[90%] max-w-[500px] bg-black/30 backdrop-blur-md
        shadow-2xl shadow-black p-8 rounded-2xl flex flex-col items-center justify-center gap-4 z-10 border border-white/10"
        onSubmit={handleSignIn}
      >
        
        <h1 className='text-white text-[30px] font-bold mb-4 text-center'>
          Sign In to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <div className='w-full'>
          <input
            type='email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Your Email'
            className='w-full h-[55px] outline-none px-5 border border-white/30 focus:border-blue-400
            bg-white/10 text-white placeholder-gray-300 rounded-full text-lg transition-all'
          />
        </div>

        <div className="w-full h-[55px] relative mt-2">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full outline-none px-5 border border-white/30 focus:border-blue-400
                   bg-white/10 text-white placeholder-gray-300 rounded-full text-lg transition-all pr-12"
          />

          <div 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOff size={24} /> : <IoEye size={24} />}
          </div>
        </div>

        {localError && (
          <div className='w-full bg-red-500/20 border border-red-500/50 p-2 rounded-lg text-center'>
            <p className='text-red-200 text-sm font-medium'>{localError}</p>
          </div>
        )}

        <button 
          type='submit'
          disabled={loading}
          className={`min-w-[150px] h-[50px] mt-4 font-bold rounded-full text-[18px] 
          transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95
          ${loading ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-50'}`}
        >
          {loading ? "Signing In..." : "Sign In"} 
        </button>

        <p className='text-gray-300 text-lg mt-4'>
          Don't have an account?{" "}
          <span 
            className='text-blue-400 font-bold cursor-pointer hover:underline hover:text-blue-300 transition-all'
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
        </p>

      </form>
    </div>
  );
};

export default SignIn;
