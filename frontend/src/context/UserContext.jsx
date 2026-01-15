import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {

  const serverUrl = "http://localhost:5000"; 

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null); // Blob/Preview URL
  const [backendImage, setBackendImage] = useState(null);   // File object for upload
  const [selectedImage, setSelectedImage] = useState(null); // String URL (preset)
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const handleCurrentUser = async () => {
  setLoading(true);
  try {
    const result = await axios.get(`${serverUrl}/api/auth/current`, {
      withCredentials: true,
    });
    setUserData(result.data.user);
  } catch {
    setUserData(null);
  } finally {
    setLoading(false);
  }
};
  
  const geminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/users/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error("Error in Gemini response:", error);
      // Optional: You could set a temporary error state here if you want the UI to know
      return null; 
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        serverUrl,
        userData,
        setUserData,
        geminiResponse,
        loading,
        setLoading,
        error,
        
        // Image States
        selectedImage,
        setSelectedImage,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        
     
        handleCurrentUser // Exporting this is useful if you want to reload user data manually (e.g. after profile update)
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;