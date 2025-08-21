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

const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user  = await User.findById(req.userId)
        const userName  = user.name

        const assistantName  = user.assistantName
        const result  = await geminiResponse(command, assistantName, userName);

        const jsonMatch = result.match(/{.*?}/);
        if (jsonMatch) {
            const jsonResponse = JSON.parse(jsonMatch[0]);
            const type = jsonResponse.type;
            return res.status(200).json(jsonResponse);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('askToAssistant Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getCurrentuser, UpdateAssistant, askToAssistant }