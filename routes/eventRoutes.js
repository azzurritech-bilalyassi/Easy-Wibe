const router = require("express").Router();
const {
  createEvent,
  updateEvent,
  publishEvent,
  getAdminEvents,
  getPublishedEvents
} = require("../controllers/eventController");

const { auth, adminOnly } = require("../middleware/authMiddleware");


// 🧑‍💼 ADMIN ROUTES
router.post("/", auth, adminOnly, createEvent);
router.put("/:id", auth, adminOnly, updateEvent);
router.patch("/:id/publish", auth, adminOnly, publishEvent);
router.get("/admin/all", auth, adminOnly, getAdminEvents);


// 👤 USER ROUTE
router.get("/published", auth, getPublishedEvents);

module.exports = router;