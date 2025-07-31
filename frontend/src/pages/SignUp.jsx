import React, { useContext, useState } from 'react';
import bg from '../assets/va.jpg';
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { serverUrl, userData, setUserData, } = useContext(UserDataContext)
  const [loading, setLoading] = useState(false)
  const [err, setError] = useState("")
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      setLoading(false);
      navigate('/costomize');
    } catch (error) {
      setUserData(null);
      setLoading(false);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('No response from server.');
      } else {
        setError('Request failed: ' + error.message);
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#0000003d] backdrop-blur
       shadow-lg shadow-black p-6 rounded-lg flex flex-col items-center justify-center gap-2  " onSubmit={handleSignup}>

        <h1 className='text-white text-[30px] font-semibold mb-2'>Register to <span className='text-blue-400 '>Virtual Assistant</span></h1>
        <input type='text'
          placeholder='Enter Your Name'
          className='w-full h-[60px] 
                    outline-none px-2 border-2 text-white placeholder-gray-300
                      px-[20px] py-[10px] rounded-full text-lg'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}></input>


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
        <button type='submit' disabled={loading}
          className="min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] 
          transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
        > {loading ? 'Signing up...' : 'Sign up'}</button>

        <p className='text-white text-lg mt-4 ' >
          Already Have an account?{' '}
          <span className='text-black font-bold cursor-pointer'
            onClick={() => navigate('/signin')}>Sign in</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
