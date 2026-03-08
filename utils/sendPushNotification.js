const admin = require("../configs/firebase");

const sendPushNotification = async (token, title, message) => {
  const payload = {
    notification: {
      title: title,
      body: message,
    },
    token: token,
  };

  try {
    await admin.messaging().send(payload);
  } catch (error) {
    console.log("Push Error:", error);
  }
};

module.exports = sendPushNotification;
