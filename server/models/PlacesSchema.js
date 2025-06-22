const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: { 
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],     // ✅ ARRAY OF NUMBERS REQUIRED
      required: true,
    }
  },
  bestTime: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  languages: [String],
  attractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction',
  }],
  monuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
  }],
  hotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  }],
  gallery: [String],
  souvenirs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Souvenir',
  }],
  contact: {
    phone: String,
    email: String,
    website: String,
  },
}, { timestamps: true });

placeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Place", placeSchema);
