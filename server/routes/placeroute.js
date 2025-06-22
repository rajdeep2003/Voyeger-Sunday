const express = require("express");
const placeroutes = express.Router();
const { createPlace, getAllPlaces, getPlaceById } = require("../middleware/placesController");
// Create Place (Single or Multiple Images Supported)
placeroutes.post("/createPlace", createPlace);

// Get All Places
placeroutes.get("/getAllPlaces", getAllPlaces);

// Get Place by ID
placeroutes.get("/:id",getPlaceById);

// // Update Place by ID
// router.patch("/:id", placeController.updatePlace);

// // Delete Place by ID
// router.delete("/:id", placeController.deletePlace);

module.exports = placeroutes;
