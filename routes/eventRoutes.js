const router = require("express").Router();
const {
  createEvent,
  updateEvent,
  publishEvent,
  getPublishedEvents,
  getAllEvents,
  toggleFavorite,
} = require("../controllers/eventController");

const { auth, adminOnly } = require("../middleware/authMiddleware");

router.post("/", auth, adminOnly, createEvent);
router.put("/:id", auth, adminOnly, updateEvent);
router.get("/", auth, adminOnly, getAllEvents);
router.put("/:id/favorite", auth, toggleFavorite);
router.patch("/:id/publish", auth, adminOnly, publishEvent);
router.get("/published", auth, getPublishedEvents);

module.exports = router;
