const admin = require("firebase-admin");
const serviceAccount = require("./opa-need-firebase-adminsdk-fbsvc-b14df77799.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
