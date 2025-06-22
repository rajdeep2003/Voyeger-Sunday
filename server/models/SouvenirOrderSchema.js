const mongoose = require("mongoose");
// firstName: "",
//     lastName: "",
//     email: "",
//     phone: "", 
//     address: "",
//     city: "",
//     zipCode: "",
//     country: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardName: "",
//     deliveryDate: "",
//     specialInstructions: "",

const souvenirOrderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        
    },
    itemsName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        
    },
    orderDate: {
        type: String,
        
    },
    deliveryDate: {
        type: String,
        required: true,
    },
    specialInstructions: {
        type: String,
       
    },
});

const SouvenirOrder = mongoose.model("SouvenirOrder", souvenirOrderSchema);

module.exports = SouvenirOrder; 