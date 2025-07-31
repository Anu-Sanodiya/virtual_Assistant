import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const HomePage = () => {
  const {userData} = useContext(UserDataContext)


  return (
       <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000080] flex flex-col justify-center items-center'>
<div className="w-[500px] h-[400px] flex justify-center items-center overflow-hidden 
rounded-4xl">
  <img src={userData?.assistantImage} alt='' className='
  h-full object-cover '/>
</div>
      
    </div>
  )
}

export default HomePage
