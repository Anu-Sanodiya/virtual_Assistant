import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useRef } from 'react'
import ai from '../assets/ai.gif'
import user from '../assets/user.gif'
import { useEffect } from 'react'
// import {BiMenuAltRight} from "react-icons/bi"



const HomePage = () => {

  const { setUserData, userData, geminiResponse, serverUrl } = useContext(UserDataContext)
  const navigate = useNavigate()
  const [listening, setlistening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("")

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef=useRef(false)



  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
        { withCredentials: true }
      )
      setUserData(null);
      navigate('/signin')

    } catch (error) { console.log("there is erroR ON", error) }
  }


  const Speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) {
      synth.onvoiceschanged = () => {
        voices = synth.getVoices();
      };
    }
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice
    }
    isSpeakingRef.current = true

    utterence.onend = () => {
      isSpeakingRef.current = false;
      if (recognitionRef.current && !isRecognizingRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Recognition restart error:", err);
          }
        }
      }
    }
    window.speechSynthesis.speak(utterence)

  }


  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    Speak(response);

    switch (type) {
      case "google_search":
        window.open(`https://www.google.com/search?q=${userInput}`, "_blank");
        break;

      case "youtube_play":
      case "youtube_search":
        window.open(`https://www.youtube.com/results?search_query=${userInput}`, "_blank");
        break;

      case "calculator_open":
        window.open("calculator://");
        break;

      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        break;

      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        break;

      case "weather-show":
        window.open(`https://www.google.com/search?q=weather+${userInput}`, "_blank");
        break;

      default:
        console.warn("Unknown command type:", type);
    }
  };


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;


    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("recognition request to start");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error:", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("recognition started");
      isRecognizingRef.current = true;
      setlistening(true);
    };

    recognition.onend = () => {
      console.log("recognition ended");
      setAiText("");
      isRecognizingRef.current = false;
      setlistening(false);

      if (!isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000); // avoid rapid restart
      }
    };

    recognition.onerror = (event) => {
      console.warn("recognition Error:", event.error);
      isRecognizingRef.current = false;
      setlistening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript)
        recognition.stop();
        isRecognizingRef.current = false;
        setlistening(false);

        try {
          const data = await geminiResponse(transcript);
          console.log("Gemini Response:", data);
          handleCommand(data);
          setAiText(data.response)
          setUserText("");
        } catch (err) {
          console.error("Error handling command:", err);
        }
      }
    };

    // Fallback: recheck every 10s
    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    // Start once
    safeRecognition();

    return () => {
      recognition.stop();
      setlistening(false);
      isRecognizingRef.current = false;

      recognition.onstart = recognition.onend = recognition.onerror = recognition.onresult = null;
      clearInterval(fallback);
    };
  }, [userData]);



  



  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000080] flex flex-col gap-[15px] justify-center items-center'>
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

      <div className="w-[400px] h-[600px] flex justify-center items-center overflow-hidden 
rounded-4xl rounded border-4 border-white gap-[10px]">
        <img src={userData?.assistantImage} alt='' className='
   h-full w-full object-cover  '/>
      </div>
      <h1 className='text-white mt-2 font-bold'>Hi! I'am {userData?.assistantName}</h1>
      { !aiText &&<img src={user} alt="ai" className='w-[200px]'/>}
      { aiText &&<img src={ai} alt="ai" className='w-[200px]'/>}
      
      <h1 className='text-white'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default HomePage
