const mongoose = require("mongoose");

const souvenirSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  vendorDetails: {
    name: String,
    email: String,
    phone: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required:true,
  },
  region: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  images: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  features: [{
    type: String,
  }],
  place: {
     type:String
  },
}, { timestamps: true });

module.exports = mongoose.model("Souvenir", souvenirSchema);
