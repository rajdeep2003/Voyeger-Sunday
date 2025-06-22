const mongoose = require("mongoose");

const avaterschema = new mongoose.Schema({
      imageurl:{
            type:String 
        },
        email:{
            type:String,
        }
})
module.exports = mongoose.model("avater", avaterschema);