import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import Costomize2 from './Costomize2'
import img1 from "../assets/image1.jpg"
import img2 from "../assets/image2.avif"
import img3 from "../assets/image3.jpg"
import img4 from "../assets/image4.jpg"
import img5 from "../assets/image5.webp"
import img6 from "../assets/loginPage.jpg"
import img7 from "../assets/va2.webp"
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
const Costomize = () => {
const { serverUrl ,userData, setUserData,frontendImage,backendImage,setBackendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(UserDataContext)
  const inputImage = useRef();
  const navigate = useNavigate();
  
  const handleClick = () => {
    inputImage.current?.click(); 
    // Open file picker
    setSelectedImage("input")
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000080] flex flex-col justify-center items-center'>
<IoIosArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] text-bold '
onClick={()=>navigate('/')}/>
      <h1 className='text-white text-2xl font-bold mb-8'>
        Select your <span className='text-blue-400'>Assistant image</span>
      </h1>

      <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
        <Card image={img1} />
        <Card image={img2} />
        <Card image={img3} />
        <Card image={img4} />
        <Card image={img5} />
        <Card image={img6} />
        <Card image={img7} />

        {/* Custom Upload Card */}
        <div
          className={`h-[160px] w-[80px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] flex justify-center items-center
    rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-600 cursor-pointer 
    hover:border-white ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}
          onClick={handleClick}
        >
          {!frontendImage && (
            <RiImageAddLine className='text-white w-[25px] h-[25px] ' />
          )}
          {frontendImage && (
            <img
              src={frontendImage}
              className='w-full h-full object-cover rounded-2xl'
              alt="Uploaded preview"
            />
          )}
          <input
            type='file'
            accept='image/*'
            hidden
            ref={inputImage}
            onChange={handleFileChange}
          />
        </div>
      </div>
{selectedImage &&  <button
        type='submit'
        className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] 
        transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer'
       onClick={() => navigate('/costomize2')}
      >
        Next
      </button>}
     
    </div>
  );
};

export default Costomize;