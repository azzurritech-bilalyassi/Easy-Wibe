const User = require("../../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, location } = req.body;

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      location,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
};
