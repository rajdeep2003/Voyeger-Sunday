const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/AuthMiddleware");

const { getAllSouvenirs, getSouvenirsByVendor, createOrder, createSouvenirOrder, getSouvenirOrderById, getAllSouvenirOrders, verifyPayment, sendReceipt } = require("../controller/souvenircontroller");

router.get("/getallsouviners", getAllSouvenirs);
router.get("/vendor/:vendorName", getSouvenirsByVendor);
router.post("/create-order", createOrder);
router.post("/create-souvenir-order", authMiddleware, createSouvenirOrder);
router.post("/create-order-db", createSouvenirOrder);
router.get("/orders/:id", authMiddleware, getSouvenirOrderById);
router.get("/orders", authMiddleware, getAllSouvenirOrders);
router.post("/verify-payment", verifyPayment);
router.post("/send-receipt", sendReceipt);

module.exports = router; 