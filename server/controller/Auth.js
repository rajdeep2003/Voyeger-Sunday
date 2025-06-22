const { User } = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 
// Register User
exports.registerUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Input validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create new user
    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "User",  
      points: 0
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role , name:user.name , email:user.email, phone:user.phone},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return response without sensitive data
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      points: user.points,
    };
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
      token  
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role , name:user.name , email:user.email, phone:user.phone},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Set cookie (secure in production)
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
      cookieOptions.sameSite = 'none';
    }

    res.cookie("token", token, cookieOptions);

    // Return user data without sensitive information
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone, 
      role: user.role,
      points: user.points,
      avatarUrl: user.avatarUrl
    };

    res.json({
      success: true,
      message: "Login successful",
      token, // For clients that prefer to store token themselves
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -token');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Logout User
exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
};