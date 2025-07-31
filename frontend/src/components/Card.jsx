import React ,{useContext} from 'react'
import { UserDataContext } from '../context/UserContext'
const Card = ({ image }) => {
  const { selectedImage,
        setSelectedImage,
        setFrontendImage,
        setBackendImage,
        } = useContext(UserDataContext)
   const isSelected = selectedImage === image;
  return (
    <div
      className={`h-[160px] w-[80px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] 
    rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-600 cursor-pointer 
    hover:border-white ${selectedImage == image ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}
        onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className="h-full w-full object-cover rounded-2xl" />
    </div>

  )
}

export default Card
