const cloudinary = require("cloudinary").v2;
const {User} = require("../models/UserSchema");
const avater = require("../models/avatarSchema");
require("dotenv").config();
function isFileTypeSupport(type,supportedTypes) {
    return supportedTypes.includes(type);
}
async function uploadFiletoclodinary(file,folder) {
     const options = {folder};
     options.resource_type = "auto"
     return await cloudinary.uploader.upload(file.tempFilePath , options);
}
exports.uploadavater = async(req,res) => {
    try {
         const {userId} = req.user;
         const file = req.files.avatar;
         // validation 
         const supportedTypes = ["jpg","jpeg","png","avif"];
         const filetype = file.name.split('.')[1].toLowerCase();
         //check support kar rha h ki nhi 
         if(!isFileTypeSupport(filetype , supportedTypes)) {
        return res.status(400).json({
            success:false,
            message:"file format is not supported"
        })
      }
      // if file format is supported then cloudinary pe upload kar do using upload fun 
      const resposne = await uploadFiletoclodinary(file,process.env.FOLDER_NAME);

      // create entery in the database
      await avater.create({
        imageurl:resposne.secure_url
      })

      //update the user schema 
      const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: resposne.secure_url },
      { new: true }
    );
     res.json({
        success:true,
        user:updatedUser,
        message:'avatar is successfully uploaded'
      })
    }
    catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}