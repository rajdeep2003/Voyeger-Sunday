const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
    destination : {
        type:String
    } ,
    experienceTitle : {
        type:String
    },
    shareyourExperience : {
        type:String
    },
    imageArrayUrl: [{
    type: String  // Array of strings for  (Cloudinary URLs)
  }],
    userlocation : {
        type:String
    } ,
    time : {
       type:String
    },
    date : {
        type:String
    }
})
module.exports = mongoose.model("Community", CommunitySchema);
