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

const LogoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// 📧 FORGOT PASSWORD
const ForgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.status(200).json({
      message: "Reset token generated",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 RESET PASSWORD
const ResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPassword,
  ResetPassword,
};
