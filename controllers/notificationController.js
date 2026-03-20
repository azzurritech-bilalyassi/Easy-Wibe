const Notification = require("../models/Notification");
const sendPushNotification = require("../utils/sendPushNotification");

const getNotifications = async (req, res) => {
  const userId = req.user.id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .populate("eventId");

  res.json({
    success: true,
    data: notifications,
  });
};

module.exports = { getNotifications };
