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
    const response = await admin.messaging().send(payload);

    console.log("Notification sent successfully:", response);

    return {
      success: true,
      messageId: response,
    };
  } catch (error) {
    console.log("Push Error:", error);
  }
};

module.exports = sendPushNotification;
