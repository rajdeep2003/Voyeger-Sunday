const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/,"Please enter a valid 10-digit phone number"],
    },
    role: {
        type: String,
        enum: ["Admin", "User" , "Owner" , "Vendors"],
        default : "User"
    },
    token: {
        type: String
    },
    avatarUrl : {
        type: String
    }
    ,
    review: [
        {
            type:Number
        }
    ],
    points:{
        type:Number,
    } 
})
const User = mongoose.model("user", userSchema);

module.exports = {
    User
}