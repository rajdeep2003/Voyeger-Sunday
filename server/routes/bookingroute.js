const express = require("express");
const bookingrouter = express.Router();

// Bookings
const { createBooking, cancelBooking, getMyBookings } = require("../controller/bookingcontroller");
const { authMiddleware } = require("../middleware/authMiddleware");

// Souvenirs
const { createSouvenir, getSouvenirsByPlace, getAllSouvenirs } = require("../controller/Souviners");

// Email controller
const { sendBookingReceiptEmail } = require("../controller/emailController");

bookingrouter.post("/booking", authMiddleware, createBooking);
bookingrouter.delete("/cancel", authMiddleware, cancelBooking);
bookingrouter.get("/mybookingdetails", authMiddleware, getMyBookings);

// Send booking receipt email
bookingrouter.post("/send-receipt", sendBookingReceiptEmail);

// Souvenirs
bookingrouter.post("/createsouvenir", authMiddleware, createSouvenir);
bookingrouter.get("/souvenirs/place/:place", getSouvenirsByPlace);
bookingrouter.get("/souvenirs/getallsouviners", getAllSouvenirs);

module.exports = bookingrouter;
