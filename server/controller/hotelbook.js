const Hotel = require('../models/HotelSchema');
const Razorpay = require('razorpay');
const crypto = require("crypto");

const instance = new Razorpay({  
    key_id: "rzp_test_wb29ohYja8YQoG",
    key_secret: "0BlelHv2GYnSWQRtR2fqDd63"
}); 

// Get hotel by name
const getHotelByName = async (req, res) => { 
    try {
        const hotel = await Hotel.findOne({ name: req.params.name });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Get all hotels
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get hotel by ID
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Filter hotels by search query and price range
const filterHotels = async (req, res) => {
    try {
        const { searchQuery, minPrice, maxPrice } = req.query;
        let query = {};
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { location: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        if (minPrice && maxPrice) {
            query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }
        const hotels = await Hotel.find(query);
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check room availability
const checkRoomAvailability = async (req, res) => {
    try {
        const { hotelId, roomType, rooms } = req.body;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const roomTypeData = hotel.roomTypes.find(rt => rt.type.toLowerCase() === roomType.toLowerCase());
        if (!roomTypeData) {
            return res.status(404).json({ message: "Room type not found" });
        }
        const isAvailable = roomTypeData.available >= parseInt(rooms);
        res.status(200).json({ 
            available: isAvailable,
            remainingRooms: roomTypeData.available
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update room availability after booking
const updateRoomAvailability = async (req, res) => {
    try {
        const { hotelId, roomType, rooms } = req.body;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const roomTypeData = hotel.roomTypes.find(rt => rt.type.toLowerCase() === roomType.toLowerCase());
        if (!roomTypeData) {
            return res.status(404).json({ message: "Room type not found" });
        }
        if (roomTypeData.available < parseInt(rooms)) {
            return res.status(400).json({ message: "Not enough rooms available" });
        }
        roomTypeData.available -= parseInt(rooms);
        await hotel.save();
        res.status(200).json({ 
            message: "Room availability updated successfully",
            remainingRooms: roomTypeData.available
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Razorpay order
const createOrder = async (req, res) => {
    const { hotelId, amount } = req.body;
    if (!hotelId || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid hotelId or amount" });
    }
    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const totalAmount = Math.round(amount * 100); // in paise
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };
        instance.orders.create(options, (err, order) => {
            if (err || !order) {
                console.error("Error creating Razorpay order", err);
                return res.status(500).json({ message: "Unable to create order", error: err?.message || 'Unknown error', order: null });
            }
            // Always return order and hotel, even if order is null
            res.json({ order, hotel });
        });
    } catch (error) {
        res.status(500).json({ message: error.message, order: null });
    }
};

// Verify Razorpay payment
const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const hmac = crypto.createHmac("sha256", '0BlelHv2GYnSWQRtR2fqDd63');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hmac.digest("hex");
    if (digest === razorpay_signature) {
        res.json({ status: "ok" });
    } else {
        res.status(400).json({ status: "invalid signature" });
    }
};

// Update hotel by name
const updateHotelByName = async (req, res) => {
    console.log(`Backend: Received PUT request to update hotel by name: ${req.params.name}`);
    try {
        const hotelName = req.params.name;
        const updatedData = req.body;
        
        console.log("Backend: Update data received from frontend:", updatedData._id);

        const updatedHotel = await Hotel.findOneAndUpdate( 
            { name: hotelName }, 
            updatedData, 
            { new: true, runValidators: true }
        );

        if (!updatedHotel) {
            console.error(`Backend Error: Hotel with name "${hotelName}" not found. Cannot update.`);
            return res.status(404).json({ message: "Hotel not found" });
        }

        console.log(`Backend: Successfully updated hotel "${hotelName}".`);
        res.status(200).json({ 
            message: "Hotel updated successfully", 
            hotel: updatedHotel 
        });

    } catch (error) {
        console.error(`Backend: An unexpected error occurred while updating hotel "${req.params.name}":`, error);
        res.status(500).json({ message: "Failed to update hotel", error: error.message });
    }
};

module.exports = {
    getAllHotels,
    getHotelById,
    getHotelByName,
    filterHotels,
    checkRoomAvailability,
    updateRoomAvailability,
    createOrder,
    verifyPayment,
    updateHotelByName
}; 