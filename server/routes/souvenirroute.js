const express = require("express");
const router = express.Router();

const { getAllSouvenirs, getSouvenirsByVendor } = require("../controller/souvenircontroller");

router.get("/getallsouviners", getAllSouvenirs);
router.get("/vendor/:vendorName", getSouvenirsByVendor);

module.exports = router; 