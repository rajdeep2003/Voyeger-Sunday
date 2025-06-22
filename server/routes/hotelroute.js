const express = require('express');
const router = express.Router();
const { getAllHotels, getHotelById, getHotelByName, filterHotels, checkRoomAvailability, updateRoomAvailability, updateHotelByName } = require('../controller/hotelbook');

// Get all hotels
router.get('/', getAllHotels);

// Get hotel by ID 
router.get('/id/:id', getHotelById);

// Filter hotels
router.get('/filter/search', filterHotels);

// Check room availability
router.post('/check-availability', checkRoomAvailability);

// Update room availability
router.post('/update-availability', updateRoomAvailability);

//Get hotel by name
router.get('/name/:name', getHotelByName);

// Update hotel by name
router.put('/name/:name', updateHotelByName);

module.exports = router; 