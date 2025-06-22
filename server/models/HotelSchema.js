const mongoose = require("mongoose");
const Place = require("../models/PlacesSchema")
const HotelOwner = require("../models/hoteloner")
const hotelSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Place", 
    required:true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String, 
    required: true,
  },
  geolocation: {
    latitude: Number,
    longitude: Number
  },
  image: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelOwner",
  },
  ownerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  ownerPassword: {
    type: String,
    
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  images: [String],
  amenities: [String],
  description: String,
  duration: String,  
  people: String,   
  roomTypes: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Number },
      total: { type: Number }
    }
  ],
  bookingstatus: [
    {
      bookingId: String,
      roomId: String,
      roomType: String,
      userId: String,
      email: String,
      phone: String,
      checkIn: String,
      checkOut: String,
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });
module.exports = mongoose.model("Hotel", hotelSchema);
