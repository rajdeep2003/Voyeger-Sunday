const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewCount:{
    type:Number,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
})
module.exports = mongoose.model("Review", reviewSchema);
