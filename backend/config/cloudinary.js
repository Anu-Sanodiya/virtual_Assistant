const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const uploadCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto" // supports images, videos, etc.
    });

    fs.unlinkSync(filePath); // clean up file after up1load
    return uploadResult.secure_url;

  } catch (error) {
    // Safe cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Pass the error to controller
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

module.exports = uploadCloudinary;
