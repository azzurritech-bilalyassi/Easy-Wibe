const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ❌ Ye fields update nahi hone chahiye
    const restrictedFields = [
      "password",
      "role",
      "isBlocked",
      "resetPasswordToken",
      "resetPasswordExpire",
      "_id",
    ];

    // 🔥 Dynamic update (jo field aaye wo update ho)
    Object.keys(req.body).forEach((key) => {
      if (!restrictedFields.includes(key)) {
        user[key] = req.body[key];
      }
    });

    // ✅ Image update
    if (req.file) {
      user.profileImage = req.file.path;
    }

    // ✅ Password change (secure way)
    if (req.body.oldPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.oldPassword);

      if (!isMatch) {
        return res.status(400).json({ message: "Old password incorrect" });
      }

      user.password = req.body.newPassword; // pre-save hook hash karega
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
