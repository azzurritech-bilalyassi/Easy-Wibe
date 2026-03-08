const router = require("express").Router();
const {
  getNotifications,
  sendNotification,
} = require("../controllers/notificationController");

router.post("/", sendNotification);
router.get("/", getNotifications);

module.exports = router;
