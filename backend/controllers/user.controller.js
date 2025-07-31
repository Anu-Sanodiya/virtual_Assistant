const User = require('../models/user.models')
const { Image } = require('../config/cloudinary')

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
        return res.status(400).json({
            message: "get current user error"
        }, { new: true }).select("password")

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

        return res.status(200).json({
            message: 'Assistant updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.error('UpdateAssistant Error:', error);
      return   res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = { getCurrentuser, UpdateAssistant }