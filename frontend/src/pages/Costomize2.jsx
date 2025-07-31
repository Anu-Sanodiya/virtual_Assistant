
import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

import { IoIosArrowRoundBack } from "react-icons/io";
const Costomize2 = () => {
  const { userData, backendImage, selectedImage, setUserData, serverUrl, error } = useContext(UserDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || " ")
  const [loading, setLoading] = useState(false)
const navigate = useNavigate();
  const handleUpdateAssistant = async () => {
    try {
      let formdata = new FormData(); // ✅

      formdata.append("assistantName", assistantName)
      if (backendImage) {
        formdata.append("assistantImage", backendImage)
      } else {
        formdata.append("imageurl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formdata, { withCredentials: true })
      console.log(result.data)
      setUserData(result.data)
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000080] flex flex-col justify-center items-center'>
<IoIosArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] text-bold '
onClick={()=>navigate('/costomize')}/>
      <h1 className='text-white text-2xl font-bold mb-8'>
        Enter your Assistant name
      </h1>

      <input
        type='text'
        value={assistantName}
        required

        placeholder='eg. sifra '
        className='mt-3 w-full max-w-[600px] h-[60px] outline-none px-2 border-2 
          text-white placeholder-gray-300  px-[20px] py-[10px] rounded-full text-lg'
        onChange={(e) => setAssistantName(e.target.value)} />


      {assistantName && <button
        type='submit'
        className='min-w-[300px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] 
        transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer'
        disabled={loading}
        onClick={()=>{handleUpdateAssistant()}}
      >
        {!loading ? "Finally Create Your Assistant " : "Loading..."}
      </button>}

    </div>
  )
}

export default Costomize2
