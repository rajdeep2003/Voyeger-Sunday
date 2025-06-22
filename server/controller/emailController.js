const { sendBookingReceipt } = require("../config/emailService");

// Controller for sending booking receipt email
const sendBookingReceiptEmail = async (req, res) => {
  console.log('📧 Email Controller: sendBookingReceiptEmail called');
  console.log('📧 Email Controller: Request body:', req.body);
  console.log('📧 Email Controller: Request headers:', {
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent']
  });

  try {
    const bookingDetails = req.body;
    console.log('📧 Email Controller: Extracted booking details from request body');
    
    // Validate required fields
    const requiredFields = [
      'userName', 'userEmail', 'hotelName', 'hotelLocation', 
      'roomType', 'rooms', 'checkIn', 'checkOut', 'guests', 
      'price', 'finalPrice', 'bookingId', 'bookingDate'
    ];
    
    console.log('📧 Email Controller: Validating required fields...');
    console.log('📧 Email Controller: Required fields:', requiredFields);
    console.log('📧 Email Controller: Provided fields:', Object.keys(bookingDetails));
    
    for (const field of requiredFields) {
      console.log(`📧 Email Controller: Checking field '${field}':`, {
        exists: !!bookingDetails[field],
        value: bookingDetails[field],
        type: typeof bookingDetails[field]
      });
      
      if (!bookingDetails[field]) {
        console.error(`📧 Email Controller: Missing required field: ${field}`);
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    console.log('📧 Email Controller: All required fields validated successfully');

    // Send the email
    console.log('📧 Email Controller: Calling sendBookingReceipt service...');
    const result = await sendBookingReceipt(bookingDetails);
    console.log('📧 Email Controller: sendBookingReceipt service returned:', result);
    
    if (result.success) {
      console.log('📧 Email Controller: Email sent successfully, sending success response');
      res.status(200).json({
        success: true,
        message: "Booking receipt sent successfully",
        messageId: result.messageId
      });
    } else {
      console.error('📧 Email Controller: Email service failed, sending error response');
      res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: result.error
      });
    }
  } catch (error) {
    console.error('📧 Email Controller: Unexpected error in sendBookingReceiptEmail');
    console.error('📧 Email Controller: Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

console.log('📧 Email Controller: Module loaded successfully');

module.exports = {
  sendBookingReceiptEmail
}; 