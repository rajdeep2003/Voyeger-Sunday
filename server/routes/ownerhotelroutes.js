const express = require("express");
const ownerHotelRoutes = express.Router();
 
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const { createHotel, getSingleHotel, updateHotel, deleteHotel, getOwnerHotels } = require("../controller/hotelcontroller");
ownerHotelRoutes.post("/create", authMiddleware, authorizeRoles("Owner"), createHotel);
ownerHotelRoutes.get("/my-hotels", authMiddleware, authorizeRoles("Owner"), getOwnerHotels);
ownerHotelRoutes.get("/:id", authMiddleware, authorizeRoles("Owner"), getSingleHotel);
ownerHotelRoutes.put("/:id", authMiddleware, authorizeRoles("Owner"), updateHotel);
ownerHotelRoutes.delete("/:id", authMiddleware, authorizeRoles("Owner"), deleteHotel);

module.exports = ownerHotelRoutes;
 