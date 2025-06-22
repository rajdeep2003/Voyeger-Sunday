# Email Setup Guide

## Prerequisites
1. A Gmail account (rajdeep2003002@gmail.com)
2. Gmail App Password (not your regular password)

## Setup Steps

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification if not already enabled

### 2. Generate App Password
- Go to Google Account settings
- Navigate to Security
- Under "2-Step Verification", click on "App passwords"
- Select "Mail" as the app and "Other" as the device
- Copy the generated 16-character password

### 3. Configure Environment Variables
Create a `.env` file in the server directory with the following content:

```env
# Email Configuration
EMAIL_PASSWORD=your_16_character_app_password_here

# Other existing environment variables
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_folder_name
```

### 4. Test the Setup
1. Start your server: `npm start`
2. Make a hotel booking
3. Click "YES" when prompted for payment simulation
4. Check if the email is sent to the user's email address

## Troubleshooting

### Common Issues:
1. **Authentication failed**: Make sure you're using the App Password, not your regular Gmail password
2. **Email not sending**: Check if the EMAIL_PASSWORD is correctly set in your .env file
3. **Server error**: Ensure nodemailer is installed (`npm install nodemailer`)

### Security Notes:
- Never commit your .env file to version control
- Keep your App Password secure
- Consider using environment-specific email configurations for production

## Email Template
The booking receipt email includes:
- Hotel details
- Booking information
- Guest details
- Payment summary
- Professional styling with Voyager branding 