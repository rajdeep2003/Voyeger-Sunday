const Souvenir = require("../models/SouvenirsSchema");
const cloudinary = require("cloudinary").v2;

async function uploadFileToCloudinary(file, folder) {
  const options = { folder, resource_type: "auto" };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function safeJSONParse(input, fallback = []) {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

exports.createSouvenir = async (req, res) => {
  try {
    const { name, description, price, category, region, features, place } = req.body;

    if (!name || !description || !price || !category || !region || !place) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ success: false, message: "Invalid price. Must be a number." });
    }

    const vendorDetails = {
      name: req.user?.name,
      email: req.user?.email,
      phone: req.user?.phone,
    };

    const parsedFeatures = features ? safeJSONParse(features, []) : [];

    const souvenirImages = req.files?.imageFile;
    if (!souvenirImages) {
      return res.status(400).json({ success: false, message: "Please provide at least one image file." });
    }

    const supportedTypes = ["jpg", "jpeg", "png", "avif"];
    const filesArray = Array.isArray(souvenirImages) ? souvenirImages : [souvenirImages];

    const uploadedGallery = [];

    for (const file of filesArray) {
      const fileType = file.name.split(".").pop().toLowerCase();
      if (!supportedTypes.includes(fileType)) {
        return res.status(400).json({ success: false, message: `Unsupported file type: ${fileType}` });
      }
      const response = await uploadFileToCloudinary(file, "VOYAGER_Souvenirs_FOLDER");
      uploadedGallery.push(response.secure_url);
    }

    const newSouvenir = await Souvenir.create({
      name,
      description,
      price: parsedPrice,
      category,
      vendorDetails,
      region,
      features: parsedFeatures,
      images: uploadedGallery,
      thumbnail: uploadedGallery[0],
      place: place.toLowerCase(),
    });

    res.status(201).json({ success: true, data: newSouvenir });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getSouvenirsByPlace = async (req, res) => {
  try {
    const { place } = req.params;

    const souvenirs = await Souvenir.find({ place: place.toLowerCase() });

    if (souvenirs.length === 0) {
      return res.status(404).json({ success: false, message: `No souvenirs found for place: ${place}` });
    }

    res.status(200).json({ success: true, count: souvenirs.length, data: souvenirs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getAllSouvenirs = async (req, res) => {
  try {
    const souvenirs = await Souvenir.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: souvenirs.length, data: souvenirs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getSouvenirsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const souvenirs = await Souvenir.find({
      category: { $regex: `^${category}$`, $options: "i" },
    });

    if (souvenirs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: `No souvenirs found for category: ${category}` });
    }

    res
      .status(200)
      .json({ success: true, count: souvenirs.length, data: souvenirs });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getSouvenirsByVendorName = async (req, res) => {
  try {
    const { vendorName } = req.params;

    const souvenirs = await Souvenir.find({
      "vendorDetails.name": { $regex: `^${vendorName}$`, $options: "i" }
    });

    if (souvenirs.length === 0) {
      return res.status(404).json({ success: false, message: `No souvenirs found for vendor: ${vendorName}` });
    }

    res.status(200).json({ success: true, count: souvenirs.length, data: souvenirs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
