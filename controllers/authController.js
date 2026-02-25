const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already Exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    if (user) {
      const token = generateToken(user);
      res.status(201).json({
        user,
        token,
        message: "User registered successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);
      res.status(201).json({
        user,
        token,
        message: "Login successfully",
      });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { RegisterUser, LoginUser };
