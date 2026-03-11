const Notification = require("../models/Notification");
const User = require("../models/User");
const sendPushNotification = require("../utils/sendPushNotification");

// const sendNotification = async (req, res) => {
//   const { title, message } = req.body;

//   const users = await User.find({ deviceToken: { $ne: null } });

//   for (let user of users) {
//     await Notification.create({
//       title,
//       message,
//       userId: user._id,
//     });

//     await sendPushNotification(user.deviceToken, title, message);
//   }

//   res.json({
//     success: true,
//     message: "Notification sent",
//   });
// };

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
