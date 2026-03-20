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

    return {
      success: true,
      messageId: response,
    };
  } catch (error) {
    console.log("Push Error:", error);

    // 🔥 VERY IMPORTANT (ye missing hai tumhare code me)
    return {
      success: false,
      error: error.errorInfo || error,
    };
  }
};

module.exports = sendPushNotification;