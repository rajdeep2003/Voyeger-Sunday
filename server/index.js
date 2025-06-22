const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const connectDB = require("./config/database");
const { connectClodinary } = require("./config/cloudinary");
const authroutes  = require("./routes/authroute")
const placeroutes = require("./routes/placeroute")
const ownerHotelRoutes = require("./routes/ownerhotelroutes");
const hotelRouter = require("./routes/hotelroute");
const orderRouter = require("./routes/orderRoute");
const bookingrouter = require("./routes/bookingroute");
const souvenirrouter = require("./routes/souvenirroute");
dotenv.config();

// Connect to Database & Cloudinary
connectDB();
connectClodinary();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
 
app.get("/", (req, res) => {
    res.send(" Voyager API Server is Running");
});
 
app.use("/api/users", authroutes);
app.use("/api/places", placeroutes);    
app.use("/api/hotels", hotelRouter);
app.use("/api/orders", orderRouter);
app.use("/api/bookings", bookingrouter);
app.use("/api/souvenirs", souvenirrouter);

app.use("/api/owner/hotel", ownerHotelRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
