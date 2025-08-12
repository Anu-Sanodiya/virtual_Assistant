import React, { useContext, useState } from 'react';
import bloging from '../assets/loginPage.jpg';
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { serverUrl ,userData, setUserData,loading ,setLoading } = useContext(UserDataContext)
  
  const [err, setError] = useState("")
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(serverUrl)
    setError('')
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, {
         email, password

      }, { withCredentials: true })
     setUserData(result.data)
     setLoading(false)
     navigate("/")
    }

    catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setError(error.response.data.message)
      if (error.response) {
      console.error("📥 Server responded:", error.response);
      setError(error.response.data.message || 'Signup failed');
    } else if (error.request) {
      console.error("🛑 No response from server:", error.request);
      setError("No response from server.");
    } else {
      console.error("⚠️ Setup error:", error.message);
      setError("Request setup failed: " + error.message);
    }
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bloging})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#0000003d] backdrop-blur
       shadow-lg shadow-black p-6 rounded-lg flex flex-col items-center justify-center gap-2  " onSubmit={handleSignIn}>

        <h1 className='text-white text-[30px] font-semibold mb-2'>Sign In to <span className='text-gray-800 '>Virtual Assistant</span></h1>
        

        <input type='email'
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Your Email '
          className='mt-3 w-full h-[60px] outline-none px-2 border-2 
         text-white placeholder-gray-300  px-[20px] py-[10px] rounded-full text-lg'>

        </input>


        <div className="w-full h-[60px] border-2 border-white bg-transparent rounded-full relative text-lg mt-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full outline-none px-[20px] py-[10px] text-white 
                   placeholder-gray-300 bg-transparent rounded-full text-lg"
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute top-1/2 right-6 transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-1/2 right-6 transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>{err.length > 0 && <p className='text-red-500 text-[12px]'>*{err}</p>}
        <button type='submit'
          className="min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] 
          transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
        >Sign In </button>

        <p className='text-white text-lg mt-4 ' >
         Want to create a new account? {' '}
          <span className='text-blue-400 font-bold cursor-pointer'
            onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;