const Booking = require("../models/bookingschema");
const Hotel = require("../models/HotelSchema");

// Create Booking
const createBooking = async (req, res) => {
    try {
        const { hotelId, bookingdetails } = req.body;
        const userId = req.user.id;  

        const booking = new Booking({
            userdetails: userId,
            hoteldetails: hotelId,
            bookingdetails
        }); 

        await booking.save();

        // Add booking details to Hotel document
        await Hotel.findByIdAndUpdate(hotelId, {
            $push: { bookingStatus: bookingdetails }
        });

        res.status(201).json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const { bookingId, hotelId } = req.body;

        // Delete booking document
        await Booking.deleteOne({ _id: bookingId });

        // Remove booking from Hotel.bookingStatus array
        await Hotel.findByIdAndUpdate(hotelId, {
            $pull: { bookingStatus: { bookingId: bookingId } }
        });

        res.status(200).json({ success: true, message: "Booking canceled successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Get My Bookings
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ userdetails: userId })
            .populate({
                path: "hoteldetails",
                select: "name address.city images price"
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createBooking, cancelBooking, getMyBookings };
