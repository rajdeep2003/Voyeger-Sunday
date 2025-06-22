const Place = require("../models/PlacesSchema")
const cloudinary = require("cloudinary");

async function uploadFiletoclodinary(file, folder) {
  const options = { folder };
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}
exports.createPlace = async (req, res) => {
  try {
    const {
      name,
      longitude,  
      latitude,
      bestTime,
      rating,
      languages,
      attractions,
      monuments,
      hotels,
      souvenirs,
      contact,
    } = req.body;

    const galleryImages = req.files?.imageFile;
    const uploadedGallery = [];

    if (!galleryImages || galleryImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one image file.",
      });
    }

    const supportedTypes = ["jpg", "jpeg", "png", "avif"];

    for (const file of galleryImages) {
      const fileType = file.name.split(".").pop().toLowerCase();
      if (!supportedTypes.includes(fileType)) {
        return res.status(400).json({
          success: false,
          message: `File type ${fileType} is not supported`,
        });
      }
      const response = await uploadFiletoclodinary(file, "VOYAGER_PLACES_FOLDER");
      uploadedGallery.push(response.secure_url);
    }

    // ✅ Fix location structure
    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    const newPlace = await Place.create({
      name,
      location,     
      bestTime,
      rating,
      languages,
      attractions,
      monuments,
      hotels,
      souvenirs,
      contact,
      gallery: uploadedGallery,
    });

    res.status(201).json({
      success: true,
      data: newPlace,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// 📌 Get All Places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find()
      .populate("attractions")
      .populate("monuments")
      .populate("hotels")
      .populate("souvenirs");
    res.status(200).json({
       success: true,
        data: places 
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get Single Place
exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("attractions")
      .populate("monuments")
      .populate("hotels")
      .populate("souvenirs");

    if (!place)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: place });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Update Place
exports.updatePlace = async (req, res) => {
  try {
    const updated = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Delete Place
exports.deletePlace = async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Place deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
