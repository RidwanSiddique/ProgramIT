//userController.js
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const fs = require('fs');
const path = require('path');
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
// handles the home page
// userController.js
const userHome = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findOne({_id: userId}).populate('teamId')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    console.log('User:', user);
    console.log("User Team:", user.teamId);
    // Check if user.teamId is defined before accessing its properties
    const userTeam = user.teamId || {};
    
    // Assuming Team model has properties like TeamName, wins, losses, ties
    const teamName = userTeam.TeamName || null;
    console.log("Team name:", teamName);
    const teamStats = {
      wins: userTeam.wins || 0,
      losses: userTeam.losses || 0,
      ties: userTeam.ties || 0,
    };

    res.json({
      success: true,
      playerName: user.firstName + ' ' + user.lastName,
      teamName,
      teamStats,
    });
  } catch (error) {
    console.error('Error retrieving user home data: ', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



// user login handling
// Handles user login logics
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // validation
  if (!email && !password) {
    return res.status(408).json({
      success: false,
      message: "All Fields must be filled!",
    });
  }
  // empty password field
  if (!password) {
    return res.status(405).json({
      success: false,
      message: "Must enter a password!",
    });
  }
  // empty email field
  if (!email) {
    return res.status(406).json({
      success: false,
      message: "Must enter an email!",
    });
  }
  // check if email is valid
  if (!validator.isEmail(email)) {
    return res.status(407).json({
      success: false,
      message: "Email is not valid!",
    });
  }
  try {
    // check if entered email exists in the database.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email does not exist!",
      });
    }
    // Match the user input password with the hashed password from the database
    // bcrypt.compare will hash out the encrypted password from the database and match it with the user input in password section
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(409).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = createToken(user._id);
    res.status(200).json({
      userId: user._id,
      email,
      token,
      success: true,
      message: "passed",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// User registration handling
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // validation
  // empty email and password field
  if (!email && !password) {
    return res.status(400).json({
      success: false,
      message: "All Fields must be filled!",
    });
  }
  // empty password field
  if (!password) {
    return res.status(405).json({
      success: false,
      message: "Must enter a password!",
    });
  }
  // empty email field
  if (!email) {
    return res.status(406).json({
      success: false,
      message: "Must enter an email!",
    });
  }
  // check if email is valid
  if (!validator.isEmail(email)) {
    return res.status(407).json({
      success: false,
      message: "Email is not valid!",
    });
  }
  // check if new registration email already exists in the database.
  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(401).json({
      success: false,
      message: "Email already exists! Please login.",
    });
  }

  // hash password so the password entered by the user will be saved encrypted in the database for better security
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    const role = "user"; // Default role for regular users

    // Check if the email is for the system administrator
    if (email === "admin@admin.com") {
      role = "admin"; // Set role to "admin" for the system administrator
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role,
    });
    // create a token
    const token = createToken(user._id);
    res.status(200).json({
      userId: user._id,
      email,
      token,
      success: true,
      message: "passed",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
const removeUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the logged-in user has the role of an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to remove users",
      });
    }

    // Remove the user from the database
    await user.remove();

    res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const userProfile = async (req, res) => {
  try {
      const userId = req.params.userId;
      // Find the user by their user ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      console.log('user info:', user);
  
    
  
      res.status(200).json({

          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage,
          success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's profile with the provided data
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    // Check if a profile image URL is provided in the request body
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    // Save the updated user profile
    await user.save();

    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
      teamId: user.teamId,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add a new route for updating the user's profile image


const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const base64Image = req.body; // Since you are sending the image directly in the request body

    // Split the base64 string into the content type and the actual base64 string
    const base64Data = base64Image.split(';base64,').pop();

    // Create a buffer from the base64 string
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Define the local directory and file path where the image will be saved
    const imageDirectory = path.join(__dirname, '../uploads');
    const imagePath = path.join(imageDirectory, `profile_${userId}.jpg`);

    // Save the image to the local directory
    fs.writeFileSync(imagePath, imageBuffer);

    // Save the file path in the database
    user.profileImage = `uploads/profile_${userId}.jpg`;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, // Enable this if using HTTPS
    });

    res.status(200).json({
      success: true,
      message: 'Logged Out!',
    });
  } catch (e) {
    console.error('Logout error:', e);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = {
  loginUser,
  registerUser,
  userProfile,
  userHome,
  updateUserProfileImage,
  updateProfile,
  logout,
  removeUser,
};
