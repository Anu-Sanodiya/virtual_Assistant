import { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Costomize from './pages/Costomize'
import Costomize2 from './pages/Costomize2' // Import this
import HomePage from './pages/HomePage'
import { UserDataContext } from './context/UserContext'

function App() {
  // Assuming your Context also provides a 'loading' state. 
  // This is CRITICAL for auth apps to prevent kicking users out on refresh.
  const { userData, loading } = useContext(UserDataContext)

  // 1. Show a spinner while checking if user is logged in
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>
  }

  return (
    <Routes>
      {/* HOME ROUTE LOGIC:
         1. Is user logged in? No -> Go to SignIn
         2. Is Assistant setup? No -> Go to Customize
         3. All Good -> Show Home
      */}
      <Route 
        path="/" 
        element={
          !userData ? (
            <Navigate to="/signin" />
          ) : (
            // Check if assistant data exists. Adjust condition based on your DB structure
            (userData.assistantName && userData.assistantImage) 
              ? <HomePage /> 
              : <Navigate to="/costomize" />
          )
        } 
      />

      {/* AUTH ROUTES */}
      <Route 
        path="/signup" 
        element={!userData ? <SignUp /> : <Navigate to="/" />} 
      />

      <Route 
        path="/signin" 
        element={!userData ? <SignIn /> : <Navigate to="/" />} 
      />

      {/* CUSTOMIZATION ROUTES (Protected) */}
      <Route 
        path="/costomize" 
        element={userData ? <Costomize /> : <Navigate to="/signin" />} 
      />

      {/* Added Costomize2 and protected it */}
      <Route 
        path="/costomize2" 
        element={userData ? <Costomize2 /> : <Navigate to="/signin" />} 
      />

    </Routes>
  )
}

export default App