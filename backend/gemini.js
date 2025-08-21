const axios = require("axios")

const geminiResponse = async(prompt,assistantName, userName)=>{
  try{
    const apiUrl = process.env.GEMINI_URL 
    const prompt = `You are a virtual asistant named ${assistantName} created by ${userName} 
    You are not google. You will now behavr like a voice-enabled assistant . 
    your atsk is to understand the user's natural language input and respond wiht a JSON 
    object like this :
    {
      "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather-show",
      "userinput": "<original user input> {only remove your name from userinput if it exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only vo search baala text jaye",
      "response": "<a short spoken response to read out loud to the user>"
    }
      "type": determine the intent of the user
      "userinput": original sentence the user spoke

      "response": a short voice-frendly reply, e.g. "Sure Playing it now" , "Here's what i found", "today is tuesday " etc
      

      Type Meanings :
      "general" : if it is a factual or information question.
      "google_search" : if the user wants to search something on Google.
      "youtube_search" : if the user wants to search something on YouTube.
      "youtube_play" : if the user wants to play a YouTube video.
      "get_time" : if the user asks for the current time.
      "get_date" : if the user asks for the current date.
      "get_day" : if the user asks for the current day.
      "get_month" : if the user asks for the current month.
      "calculator_open" : if the user wants to open the calculator.
      "instagram_open" : if the user wants to open Instagram.
      "facebook_open" : if the user wants to open Facebook.
      "weather-show" : if the user wants to know the weather.

      now your userInput is -{prompt}
    `
    const   result  = await axios.post(apiUrl, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
    return result.data.candidates[0].content.parts[0].text
  }
  catch(error){
    console.error("Error occurred while fetching Gemini response:", error)
  }
}
module.exports = geminiResponse
