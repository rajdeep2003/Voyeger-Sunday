const express = require("express");
const bookingrouter = express.Router();

// Bookings
const { createBooking, cancelBooking, getMyBookings } = require("../controller/bookingcontroller");
const { authMiddleware } = require("../middleware/authMiddleware");

// Souvenirs
const {
    createSouvenir,
    getSouvenirsByPlace,
    getAllSouvenirs,
    getSouvenirsByCategory,
    getSouvenirsByVendorName
} = require("../controller/Souviners");

// Email controller
const { sendBookingReceiptEmail } = require("../controller/emailController");

// Booking routes
bookingrouter.post("/booking", authMiddleware, createBooking);
bookingrouter.delete("/cancel", authMiddleware, cancelBooking);
bookingrouter.get("/mybookingdetails", authMiddleware, getMyBookings);

// Email route
bookingrouter.post("/send-receipt", sendBookingReceiptEmail);

// Souvenir routes
bookingrouter.post("/createsouvenir", authMiddleware, createSouvenir);
bookingrouter.get("/souvenirs/place/:place", getSouvenirsByPlace);
bookingrouter.get("/souvenirs/getallsouviners", getAllSouvenirs);
bookingrouter.get("/souvenirs/category/:category", getSouvenirsByCategory);
bookingrouter.get("/souvenirs/vendor/:vendorName", getSouvenirsByVendorName);

module.exports = bookingrouter;
