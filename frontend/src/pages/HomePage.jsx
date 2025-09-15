import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
const HomePage = () => {

  const { setUserData, userData, serverUrl } = useContext(UserDataContext)
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
        { withCredentials: true }
      )
      setUserData(null);
      navigate('/signin')

    } catch (error) { console.log("there is erroR ON", error) }
  }


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.continous = true;
    recognition.lag = 'en-US'
    recognition.onresult = (event) => {

      const transcript = event.results[event.results.length - 1][0].transcript.trim();

      console.log(transcript)
    }
    recognition.start();
  }, [])


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000080] flex flex-col justify-center items-center'>
      <div className="relative w-full flex flex-col items-end gap-2 px-4 sm:px-6 md:px-8 mt-[60px]">
        <button
          type="submit"
          className="
      min-w-[180px] sm:min-w-[200px] md:min-w-[250px]
      h-[40px] sm:h-[45px] md:h-[50px]
      text-[16px] sm:text-[18px] md:text-[19px]
      text-black font-semibold bg-white rounded-full
      transition-all duration-300
      hover:scale-105 hover:shadow-xl active:scale-95
    " onClick={handleLogout}
        >
          Logout
        </button>

        <button
          type="submit"
          className="
      min-w-[180px] sm:min-w-[200px] md:min-w-[250px]
      h-[40px] sm:h-[45px] md:h-[50px]
      text-[16px] sm:text-[18px] md:text-[19px]
      text-black font-semibold bg-white rounded-full
      transition-all duration-300
      hover:scale-105 hover:shadow-xl active:scale-95
    " onClick={() => navigate('/costomize')}
        >
          Customize Your Assistant
        </button>
      </div>

      <div className="w-[500px] h-[400px] flex justify-center items-center overflow-hidden 
rounded-4xl rounded border-4 border-white gap-[10px]">
        <img src={userData?.assistantImage} alt='' className='
  h-full object-cover '/>
      </div>
      <h1 className='text-white mt-2 font-bold'>Hi! I'am {userData?.assistantName}</h1>

    </div>
  )
}

export default HomePage
