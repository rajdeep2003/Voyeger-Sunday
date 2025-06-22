const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 Email Service: Initializing...');
console.log('📧 Email Service: Environment variables check:');
console.log('   - EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
console.log('   - EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 'undefined');

// Create transporter for Gmail
console.log('📧 Email Service: Creating nodemailer transporter...');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajdeep2003002@gmail.com', // Your Gmail address
    pass: process.env.EMAIL_PASSWORD // App password from Gmail
  }
});

console.log('📧 Email Service: Transporter created successfully');

// Email template for booking receipt
const createReceiptEmail = (bookingDetails) => {
  console.log('📧 Email Service: Creating email template with booking details:', {
    userName: bookingDetails.userName,
    userEmail: bookingDetails.userEmail,
    hotelName: bookingDetails.hotelName,
    bookingId: bookingDetails.bookingId
  });

  const {
    userName,
    userEmail,
    hotelName,
    hotelLocation,
    roomType,
    rooms,
    checkIn,
    checkOut,
    guests,
    price,
    discount,
    finalPrice,
    bookingId,
    bookingDate
  } = bookingDetails;

  const discountAmount = discount ? Math.round(price * (discount / 100)) : 0;
  const subtotal = price - discountAmount;
  const tax = Math.round(subtotal * 0.12);

  console.log('📧 Email Service: Calculated email values:', {
    discountAmount,
    subtotal,
    tax,
    finalPrice
  });

  return {
    subject: `Booking Confirmation - ${hotelName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #1e40af; }
          .section h3 { margin: 0 0 10px 0; color: #1e40af; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 18px; border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Voyager Ltd.</h1>
            <h2>Booking Confirmation</h2>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Booking Information</h3>
              <div class="row">
                <span><strong>Booking ID:</strong></span>
                <span>${bookingId}</span>
              </div>
              <div class="row">
                <span><strong>Booking Date:</strong></span>
                <span>${bookingDate}</span>
              </div>
            </div>

            <div class="section">
              <h3>Guest Information</h3>
              <div class="row">
                <span><strong>Name:</strong></span>
                <span>${userName}</span>
              </div>
              <div class="row">
                <span><strong>Email:</strong></span>
                <span>${userEmail}</span>
              </div>
            </div>

            <div class="section">
              <h3>Hotel Details</h3>
              <div class="row">
                <span><strong>Hotel:</strong></span>
                <span>${hotelName}</span>
              </div>
              <div class="row">
                <span><strong>Location:</strong></span>
                <span>${hotelLocation}</span>
              </div>
            </div>

            <div class="section">
              <h3>Stay Details</h3>
              <div class="row">
                <span><strong>Room Type:</strong></span>
                <span>${roomType}</span>
              </div>
              <div class="row">
                <span><strong>Number of Rooms:</strong></span>
                <span>${rooms}</span>
              </div>
              <div class="row">
                <span><strong>Check-in:</strong></span>
                <span>${checkIn}</span>
              </div>
              <div class="row">
                <span><strong>Check-out:</strong></span>
                <span>${checkOut}</span>
              </div>
              <div class="row">
                <span><strong>Guests:</strong></span>
                <span>${guests}</span>
              </div>
            </div>

            <div class="section">
              <h3>Payment Summary</h3>
              <div class="row">
                <span>Base Price:</span>
                <span>Rs ${price}</span>
              </div>
              ${discount ? `
              <div class="row">
                <span>Discount (${discount}%):</span>
                <span>-Rs ${discountAmount}</span>
              </div>
              ` : ''}
              <div class="row">
                <span>Taxes & Fees (12%):</span>
                <span>Rs ${tax}</span>
              </div>
              <div class="row total">
                <span>Total Amount:</span>
                <span>Rs ${finalPrice}</span>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Voyager!</p>
              <p>For any queries, please contact us at support@voyager.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Function to send booking receipt email
const sendBookingReceipt = async (bookingDetails) => {
  console.log('📧 Email Service: sendBookingReceipt called with details:', {
    userEmail: bookingDetails.userEmail,
    hotelName: bookingDetails.hotelName,
    bookingId: bookingDetails.bookingId
  });

  try {
    console.log('📧 Email Service: Creating email content...');
    const emailContent = createReceiptEmail(bookingDetails);
    console.log('📧 Email Service: Email content created successfully');
    
    const mailOptions = {
      from: 'rajdeep2003002@gmail.com',
      to: bookingDetails.userEmail,
      subject: emailContent.subject,
      html: emailContent.html
    };

    console.log('📧 Email Service: Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html.length
    });

    console.log('📧 Email Service: Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('📧 Email Service: Email sent successfully!');
    console.log('📧 Email Service: Message ID:', info.messageId);
    console.log('📧 Email Service: Response:', info.response);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('📧 Email Service: Error sending email!');
    console.error('📧 Email Service: Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command
    });
    console.error('📧 Email Service: Full error object:', error);
    
    return { success: false, error: error.message };
  }
};

console.log('📧 Email Service: Module loaded successfully');

module.exports = {
  sendBookingReceipt
}; 