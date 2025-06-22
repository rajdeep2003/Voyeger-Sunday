const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userdetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hoteldetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    bookingdetails: [
        {
            bookingId: String,
            roomId: String,
            roomtype: String,
            userid: String,
            useremail: String,
            phone: String,
            checkout: Date,
            checking: Date
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
