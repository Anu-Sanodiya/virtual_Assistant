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
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
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
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;

