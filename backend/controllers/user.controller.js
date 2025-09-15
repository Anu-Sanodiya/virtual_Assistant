import { use } from 'react'

const User = require('../models/user.models')
const { uploadCloudinary } = require('../config/cloudinary')
const geminiResponse = require('../gemini')
const moment  = require('moment')

const getCurrentuser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({
                message: "user Not found "
            })
        }
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({
            message: "get current user error"
        })

    }
}

const UpdateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadCloudinary(req.file.path)


        } else {
            assistantImage = imageUrl;

        }
        const updatedUser = await User.findByIdAndUpdate(req.userId, {
            assistantName, assistantImage

        }, { new: true }).select("-password")
          if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: 'Assistant updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.error('UpdateAssistant Error:', error);
      return   res.status(500).json({ message: 'Internal Server Error' });
    }
}



export const asktoAssistant  = async (req, res) => {
  try {
    const { command } = req.body;

    // fetch user info
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    // call Gemini API
    const result = await geminiResponse(command, assistantName, userName);

    // Expecting Gemini to return a JSON block like { "type": "get_time", "value": "" }
    const jsonMatch = result.match(/{.*?}/);
    if (!jsonMatch) {
      return res.status(200).json({
        type: "general",
        value: result, // fallback to raw AI response
      });
    }

    const jsonResponse = JSON.parse(jsonMatch[0]);
    const type = jsonResponse.type

 

    switch (type) {
      case "get_date":
       return res.json({
        type,
        userInput:jsonResponse.userInput,
        response:`current date is ${moment().format("YYYY-MM-DD")}`,
       })
       break;

      case "get_time":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `current time is ${moment().format("HH:mm:ss")}`,
        })
        break;

      case "get_day":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `current day is ${moment().format("dddd")}`,
        })
        break;

      case "get_month":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        })
        break;

      case "get_year":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `current year is ${moment().format("YYYY")}`,
        })
        break;

      case "google_search":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `Opening Google search for "${jsonResponse.query || command}"`,
        });

      case "youtube_search":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `Searching YouTube for "${jsonResponse.query || command}"`,
        });

      case "youtube_play":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: `Playing YouTube video: "${jsonResponse.query || command}"`,
        });

      case "calculator_open":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: jsonResponse.response || "Opening Calculator...",
        });

      case "instagram_open":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: jsonResponse.response || "Opening Instagram...",
        });

      case "facebook_open":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response: jsonResponse.response || "Opening Facebook...",
        });

      case "weather-show":
        return res.json({
          type,
          userInput: jsonResponse.userInput,
          response:  jsonResponse.response || "Fetching weather info...", // you can plug in weather API here
        });

      case "general":
      default:
        return res.json({
          type: "general",
          userInput: jsonResponse.userInput,
          response: jsonResponse.value || result,
        });
    }

   
  } catch (error) {
    console.error("geminiresponse Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


 