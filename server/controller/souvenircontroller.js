const Souvenir = require("../models/SouvenirsSchema");
const SouvenirOrder = require("../models/SouvenirOrderSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Initialize Razorpay instance
const instance = new Razorpay({
    key_id: "rzp_test_wb29ohYja8YQoG",
    key_secret: "0BlelHv2GYnSWQRtR2fqDd63",
});

console.log("🔧 Backend: Souvenir controller initialized with Razorpay instance");

exports.getAllSouvenirs = async (req, res) => {
    console.log("📋 Backend: getAllSouvenirs called");
    try {
        const souvenirs = await Souvenir.find({});
        console.log(`📋 Backend: Found ${souvenirs.length} souvenirs`);
        res.status(200).json({
            success: true,
            data: souvenirs,
        });
    } catch (error) {
        console.error("❌ Backend: Error in getAllSouvenirs:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

exports.getSouvenirsByVendor = async (req, res) => {
    console.log("📋 Backend: getSouvenirsByVendor called with vendor:", req.params.vendorName);
    try {
        const vendorName = req.params.vendorName;
        const souvenirs = await Souvenir.find({ "vendorDetails.name": vendorName });
        console.log(`📋 Backend: Found ${souvenirs.length} souvenirs for vendor ${vendorName}`);
        res.status(200).json({
            success: true,
            data: souvenirs,
        });
    } catch (error) {
        console.error("❌ Backend: Error in getSouvenirsByVendor:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Create Razorpay order for souvenirs
exports.createOrder = async (req, res) => {
    console.log("💳 Backend: createOrder called");
    console.log("💳 Backend: Request body:", req.body);
    
    const { amount, item } = req.body;
    
    if (!amount || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        console.error("❌ Backend: Invalid amount provided:", amount);
        return res.status(400).json({ message: "Invalid amount" });
    }
    
    if (!item) {
        console.error("❌ Backend: No item details provided");
        return res.status(400).json({ message: "Item details are required" });
    }
    
    console.log("💳 Backend: Validating amount and item - OK");
    console.log("💳 Backend: Amount:", amount);
    console.log("💳 Backend: Item details:", item);
    
    try {
        const totalAmount = Math.round(amount * 100); // Convert to paise
        console.log("💳 Backend: Converting amount to paise:", totalAmount);
        
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `souvenir_order_${Date.now()}`,
        };
        
        console.log("💳 Backend: Razorpay options:", options);
        console.log("💳 Backend: Creating Razorpay order...");
        
        instance.orders.create(options, (err, order) => {
            if (err || !order) {
                console.error("❌ Backend: Error creating Razorpay order:", err);
                return res.status(500).json({ 
                    message: "Unable to create order", 
                    error: err?.message || 'Unknown error', 
                    order: null 
                });
            }
            
            console.log("✅ Backend: Razorpay order created successfully");
            console.log("✅ Backend: Order details:", order);
            
            res.json({ order, item });
        });
    } catch (error) {
        console.error("❌ Backend: Exception in createOrder:", error);
        res.status(500).json({ message: error.message, order: null });
    }
};

// Verify Razorpay payment
exports.verifyPayment = (req, res) => {
    console.log("🔐 Backend: verifyPayment called");
    console.log("🔐 Backend: Request body:", req.body);
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error("❌ Backend: Missing payment verification parameters");
        return res.status(400).json({ status: "missing parameters" });
    }
    
    console.log("🔐 Backend: Verifying payment signature...");
    
    const hmac = crypto.createHmac("sha256", '0BlelHv2GYnSWQRtR2fqDd63');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hmac.digest("hex");
    
    console.log("🔐 Backend: Generated digest:", digest);
    console.log("🔐 Backend: Received signature:", razorpay_signature);
    console.log("🔐 Backend: Signatures match:", digest === razorpay_signature);
    
    if (digest === razorpay_signature) {
        console.log("✅ Backend: Payment verification successful");
        res.json({ status: "ok" });
    } else {
        console.error("❌ Backend: Payment verification failed - invalid signature");
        res.status(400).json({ status: "invalid signature" });
    }
};

// Send souvenir order receipt email
exports.sendReceipt = async (req, res) => {
    console.log("📧 Backend: sendReceipt called");
    console.log("📧 Backend: Request body:", req.body);
    
    const {
        userName,
        userEmail,
        itemName,
        itemDescription,
        itemCategory,
        itemRegion,
        quantity,
        price,
        shippingCost,
        tax,
        finalPrice,
        deliveryAddress,
        deliveryDate,
        specialInstructions,
        paymentStatus,
        bookingDate,
        bookingId
    } = req.body;

    console.log("📧 Backend: Extracted booking details:");
    console.log("📧 Backend: - User:", userName, userEmail);
    console.log("📧 Backend: - Item:", itemName, itemCategory, itemRegion);
    console.log("📧 Backend: - Quantity:", quantity);
    console.log("📧 Backend: - Price:", price, "Final:", finalPrice);
    console.log("📧 Backend: - Booking ID:", bookingId);

    try {
        console.log("📧 Backend: Creating email transporter with:", process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
        // Create transporter
        const transporter = require('nodemailer').createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        console.log("📧 Backend: Email transporter created successfully");

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Souvenir Order Confirmation - ${bookingId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
                        <h1>Voyeger Ltd.</h1>
                        <h2>Souvenir Order Receipt</h2>
                    </div>
                    <div style="padding: 20px; background-color: #f8fafc;">
                        <h3 style="color: #1e40af;">Order Details</h3>
                        <p><strong>Order ID:</strong> ${bookingId}</p>
                        <p><strong>Order Date:</strong> ${bookingDate}</p>
                        <p><strong>Payment Status:</strong> <span style="color: green;">${paymentStatus}</span></p>
                        <h3 style="color: #1e40af; margin-top: 20px;">Customer Information</h3>
                        <p><strong>Name:</strong> ${userName}</p>
                        <p><strong>Email:</strong> ${userEmail}</p>
                        <h3 style="color: #1e40af; margin-top: 20px;">Item Details</h3>
                        <p><strong>Item Name:</strong> ${itemName}</p>
                        <p><strong>Description:</strong> ${itemDescription}</p>
                        <p><strong>Category:</strong> ${itemCategory}</p>
                        <p><strong>Region:</strong> ${itemRegion}</p>
                        <p><strong>Quantity:</strong> ${quantity}</p>
                        <h3 style="color: #1e40af; margin-top: 20px;">Delivery Information</h3>
                        <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
                        <p><strong>Preferred Delivery Date:</strong> ${deliveryDate}</p>
                        ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ''}
                        <h3 style="color: #1e40af; margin-top: 20px;">Payment Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Item Price</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(price * quantity).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Shipping</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Tax</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${tax.toFixed(2)}</td>
                            </tr>
                            <tr style="font-weight: bold;">
                                <td style="padding: 8px; border-top: 2px solid #1e40af;">Total</td>
                                <td style="padding: 8px; border-top: 2px solid #1e40af; text-align: right;">$${finalPrice.toFixed(2)}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 30px; text-align: center; color: #666;">
                            <p>Thank you for your order!</p>
                            <p>If you have any questions, please contact us at support@voyeger.com</p>
                        </div>
                    </div>
                </div>
            `,
        };
        console.log("📧 Backend: Mail options prepared");
        console.log("📧 Backend: Sending email to:", userEmail);
        // Send email
        await transporter.sendMail(mailOptions);
        console.log("✅ Backend: Email sent successfully");
        res.json({ success: true, message: "Receipt email sent successfully" });
    } catch (error) {
        console.error("❌ Backend: Error sending souvenir receipt email:", error);
        console.error("❌ Backend: Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ success: false, message: "Failed to send receipt email" });
    }
};

// Create and save souvenir order to database
exports.createSouvenirOrder = async (req, res) => {
    console.log("📝 Backend: createSouvenirOrder called");
    console.log("📝 Backend: Request body:", req.body);
    
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            zipCode,
            country,
            itemsName,
            quantity,
            price,
            orderDate,
            deliveryDate,
            specialInstructions
        } = req.body;

        // Create new souvenir order
        const newOrder = new SouvenirOrder({
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            zipCode,
            country,
            itemsName,
            quantity,
            price,
            orderDate,
            deliveryDate,
            specialInstructions
        });

        // Save order to database
        const savedOrder = await newOrder.save();
        
        console.log("✅ Backend: Souvenir order saved successfully");
        console.log("✅ Backend: Order ID:", savedOrder._id);
        
        res.status(201).json({
            success: true,
            message: "Souvenir order created successfully",
            orderId: savedOrder._id,
            order: savedOrder
        });
        
    } catch (error) {
        console.error("❌ Backend: Error creating souvenir order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create souvenir order",
            error: error.message
        });
    }
};

// Get souvenir order by ID
exports.getSouvenirOrderById = async (req, res) => {
    console.log("📋 Backend: getSouvenirOrderById called");
    console.log("📋 Backend: Order ID:", req.params.id);
    
    try {
        const order = await SouvenirOrder.findById(req.params.id);
        
        if (!order) {
            console.log("❌ Backend: Order not found");
            return res.status(404).json({
                success: false,
                message: "Souvenir order not found"
            });
        }
        
        console.log("✅ Backend: Order found successfully");
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error("❌ Backend: Error in getSouvenirOrderById:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch souvenir order",
            error: error.message
        });
    }
};

// Get all souvenir orders
exports.getAllSouvenirOrders = async (req, res) => {
    console.log("📋 Backend: getAllSouvenirOrders called");
    
    try {
        // Get query parameters for filtering and pagination
        const { page = 1, limit = 10, status, email, sortBy = 'orderDate', sortOrder = 'desc' } = req.query;
        
        console.log("📋 Backend: Query parameters:", { page, limit, status, email, sortBy, sortOrder });
        
        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (email) filter.email = { $regex: email, $options: 'i' }; // Case-insensitive search
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        console.log("📋 Backend: Filter object:", filter);
        console.log("📋 Backend: Sort object:", sort);
        console.log("📋 Backend: Skip value:", skip);
        
        // Get total count for pagination
        const totalOrders = await SouvenirOrder.countDocuments(filter);
        console.log("📋 Backend: Total orders count:", totalOrders);
        
        // Get orders with pagination, filtering, and sorting
        const orders = await SouvenirOrder.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .lean(); // Use lean() for better performance when you don't need Mongoose document methods
        
        console.log(`📋 Backend: Found ${orders.length} orders`);
        
        // Calculate pagination info
        const totalPages = Math.ceil(totalOrders / parseInt(limit));
        const hasNextPage = parseInt(page) < totalPages;
        const hasPrevPage = parseInt(page) > 1;
        
        console.log("📋 Backend: Pagination info:", {
            currentPage: parseInt(page),
            totalPages,
            hasNextPage,
            hasPrevPage
        });
        
        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalOrders,
                hasNextPage,
                hasPrevPage,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error("❌ Backend: Error in getAllSouvenirOrders:", error);
        console.error("❌ Backend: Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: "Failed to fetch souvenir orders",
            error: error.message
        });
    }
}; 