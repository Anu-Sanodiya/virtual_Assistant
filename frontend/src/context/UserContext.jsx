import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/users/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      setError(null);
    } catch (error) {
      console.error(error);
          setError(error.response?.data?.message || error.message || "Failed to fetch user data");
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
      console.error("there is error in gemini response", error);
      return null; // ✅ always return something
    }
  };


  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        serverUrl,
        selectedImage,
        setSelectedImage,
        userData,
        setUserData,
        frontendImage,
        backendImage,
        setFrontendImage,
        setBackendImage,
        loading,
        setLoading,
        error,
        geminiResponse
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;

