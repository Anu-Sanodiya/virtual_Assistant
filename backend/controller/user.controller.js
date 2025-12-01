const cloudinary = require("../config/cloudinary");
const User = require("../models/user.model");

exports.updateAssistant = async (req, res) => {
  try {
    const userId = req.user._id;
    const { assistantName, imageurl } = req.body;

    let assistantImage = imageurl || null;

    // If file uploaded → upload to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "virtual-assistant",
        width: 800,
        crop: "limit"
      });

      assistantImage = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Update Assistant Error:", error);
    res.status(500).json({ message: "Failed to update assistant", error });
  }
};
