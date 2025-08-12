import { useContext, useState } from 'react'
import { Route, Routes,Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Costomize from './pages/Costomize'
import { UserDataContext } from './context/UserContext'
import HomePage from './pages/HomePage'
import Costomize2 from './pages/Costomize2'

function App() {
    const  {userData, setUserData}=useContext(UserDataContext)
  
  return (

<Routes>
  {/* <Route 
    path="/" 
    element={
      (userData?.assistantImage && userData?.assistantName) 
        ? <HomePage /> 
        : <Navigate to="/costomize" />
    } 
  /> */}

  <Route 
    path="/signup" 
    element={<SignUp />} 
  />

  <Route 
    path="/signin" 
    element={
      !userData 
        ? <SignIn /> 
        : <Navigate to="/" />
    } 
  />

  {/* <Route 
    path="/costomize" 
    element={
      userData 
        ? <Costomize /> 
        : <Navigate to="/signin" />
    }  
  /> */}
  <Route path='/costomize' element={<Costomize/>}></Route>
  <Route path='/costomize2' element={<Costomize2/>}></Route>
  <Route path='/' element={<HomePage/>}></Route>
</Routes>

  )
}

export default App
