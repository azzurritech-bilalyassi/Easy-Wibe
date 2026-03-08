const admin = require("firebase-admin");
const serviceAccount = require("../easyvibe-notification-firebase-adminsdk-fbsvc-f2149d0bd5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
