const cloudinary = require("cloudinary").v2;
const { User } = require("../models/UserSchema");
const avater = require("../models/avatarSchema");
require("dotenv").config();

function isFileTypeSupport(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFiletoclodinary(file, folder) {
    const options = { folder };
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.uploadavater = async (req, res) => {
    try {
        const { userId } = req.user;
        const file = req.files.avatar;

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png", "avif"];
        const filetype = file.name.split(".")[1].toLowerCase();

        // Check if file type is supported
        if (!isFileTypeSupport(filetype, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format is not supported",
            });
        }

        // Upload to Cloudinary
        const resposne = await uploadFiletoclodinary(file, process.env.FOLDER_NAME);

        // Create entry in avatar schema
        await avater.create({
            imageurl: resposne.secure_url,
        });

        // Update the user schema with avatar URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatarUrl: resposne.secure_url },
            { new: true }
        );

        res.json({
            success: true,
            user: updatedUser,
            message: "Avatar is successfully uploaded",
        });
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
