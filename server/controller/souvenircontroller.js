const Souvenir = require("../models/SouvenirsSchema");

exports.getAllSouvenirs = async (req, res) => {
    try {
        const souvenirs = await Souvenir.find({});
        res.status(200).json({
            success: true,
            data: souvenirs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

exports.getSouvenirsByVendor = async (req, res) => {
    try {
        const vendorName = req.params.vendorName;
        const souvenirs = await Souvenir.find({ "vendorDetails.name": vendorName });
        res.status(200).json({
            success: true,
            data: souvenirs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}; 