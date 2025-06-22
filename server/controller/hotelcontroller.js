const Hotel = require("../models/HotelSchema");
const Place = require("../models/PlacesSchema");
const cloudinary = require("cloudinary");

async function uploadFileToCloudinary(file, folder) {
  const options = { folder, resource_type: "auto" };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function safeJSONParse(input, fallback = null) {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

exports.createHotel = async (req, res) => {
  try {
    const {
      place,
      name,
      location,
      geolocation,
      image, // for direct URL, if provided
      price,
      rating,
      images, // for direct URLs, if provided
      amenities,
      description,
      duration, 
      people,
      roomTypes,
      bookingstatus,
      isActive,
      ownerEmail,
      ownerPassword
    } = req.body;

    if (!place || !name || !price || !location || !ownerEmail || !ownerPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields: place, name, price, location, ownerEmail, or ownerPassword." });
    }

    const parsedAmenities = typeof amenities === "string" ? safeJSONParse(amenities, []) : amenities || [];
    const parsedRoomTypes = typeof roomTypes === "string" ? safeJSONParse(roomTypes, []) : roomTypes || [];
    const parsedGeolocation = typeof geolocation === "string" ? safeJSONParse(geolocation, {}) : geolocation || {};
    const parsedImages = typeof images === "string" ? safeJSONParse(images, []) : images || [];
    const parsedBookingstatus = typeof bookingstatus === "string" ? safeJSONParse(bookingstatus, []) : bookingstatus || [];
        
    // Handle main image upload (if file provided)
    let mainImage = image || "";
    if (req.files && req.files.mainImage) {
      const file = req.files.mainImage;
      const fileType = file.name.split(".").pop().toLowerCase();
      const supportedTypes = ["jpg", "jpeg", "png", "avif"];
      if (!supportedTypes.includes(fileType)) {
        return res.status(400).json({ success: false, message: `File type ${fileType} is not supported for main image.` });
      }
      const response = await uploadFileToCloudinary(file, "VOYAGER_Hotel_FOLDER");
      mainImage = response.secure_url;
    }

    // Handle gallery images upload (if files provided)
    let uploadedGallery = parsedImages;
    const HotelImages = req.files?.imageFile;
    if (HotelImages) {
      const supportedTypes = ["jpg", "jpeg", "png", "avif"];
      const filesArray = Array.isArray(HotelImages) ? HotelImages : [HotelImages];
      uploadedGallery = [...uploadedGallery];
      for (const file of filesArray) {
        const fileType = file.name.split(".").pop().toLowerCase();
        if (!supportedTypes.includes(fileType)) {
          return res.status(400).json({ success: false, message: `File type ${fileType} is not supported.` });
        }
        const response = await uploadFileToCloudinary(file, "VOYAGER_Hotel_FOLDER");
        uploadedGallery.push(response.secure_url);
      }
    }

    const newHotel = await Hotel.create({
      place,
      name,
      location,
      geolocation: parsedGeolocation,
      image: mainImage,
      owner: req.user.id,
      ownerEmail: ownerEmail.toLowerCase().trim(),
      ownerPassword,
      price,
      rating,
      images: uploadedGallery,
      amenities: parsedAmenities,
      description,
      duration,
      people,
      roomTypes: parsedRoomTypes,
      bookingstatus: parsedBookingstatus,
      isActive: isActive !== undefined ? isActive : true
    });

    await Place.findByIdAndUpdate(place, { $push: { hotels: newHotel._id } }, { new: true });
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getOwnerHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }).populate("place");
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getSingleHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, owner: req.user.id }).populate("place");
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found." });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, owner: req.user.id });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found or unauthorized." });
    }
    Object.assign(hotel, req.body);
    await hotel.save();
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found or unauthorized." });
    }
    await Place.findByIdAndUpdate(hotel.place, { $pull: { hotels: hotel._id } });
    res.status(200).json({ success: true, message: "Hotel deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
