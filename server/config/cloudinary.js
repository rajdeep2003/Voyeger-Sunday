const cloudinary = require("cloudinary").v2;
require("dotenv").config();
exports.connectClodinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("cloudinary is sucessfully connected");
  } catch (err) {
    console.log("error on the connection of cloudinary ")
  }
};
