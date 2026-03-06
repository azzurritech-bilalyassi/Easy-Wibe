const express = require("express");

const { auth } = require("../middleware/authMiddleware");
const {
  toggleFavorite,
  getUserFavoriteEvents,
} = require("../controllers/favoriteController");

const router = express.Router();

router.post("/toggle", auth, toggleFavorite);
router.get("/", auth, getUserFavoriteEvents);

module.exports = router;
