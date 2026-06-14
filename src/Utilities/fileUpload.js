require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(filePath,{
        resource_type:"auto"
    })
    console.log("File Successfully Uploaded On Cloudinary",response.url);
    return response
  } catch(error) {
    fs.unlinkSync(filePath)
    return null;
  }
};

module.exports = uploadOnCloudinary;
