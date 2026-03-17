const User = require("../models/User");
const paginatedResponse = require("../utils/paginatedResponse");
const getPagination = require("../utils/pagination");

const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const users = await User.find(query).skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    res.json(paginatedResponse(users, total, page, limit));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveDeviceToken = async (req, res) => {
  const userId = req.user._id;
  const { token } = req.body;

  await User.findByIdAndUpdate(userId, {
    deviceToken: token,
  });

  res.json({
    success: true,
    message: "Device token saved",
  });
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  saveDeviceToken,
};
