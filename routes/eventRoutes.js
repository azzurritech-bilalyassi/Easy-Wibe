const router = require("express").Router();
const {
  createEvent,
  updateEvent,
  publishEvent,
  getPublishedEvents,
  getAllEvents,
  toggleFavorite,
  getAllLocations,
} = require("../controllers/eventController");

const { auth, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.post("/", auth, adminOnly, upload.single("image"), createEvent);
router.put("/:id", auth, adminOnly, upload.single("image"), updateEvent);
router.get("/", auth, adminOnly, getAllEvents);
router.put("/:id/favorite", auth, toggleFavorite);
router.patch("/:id/publish", auth, adminOnly, publishEvent);
router.get("/published", auth, getPublishedEvents);
router.get("/locations", getAllLocations);

module.exports = router;
