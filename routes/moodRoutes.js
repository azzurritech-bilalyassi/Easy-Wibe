const express = require("express");
const router = express.Router();
const { getAllMoods, saveUserMoods } = require("../controllers/moodController");
const { auth } = require("../middleware/authMiddleware");

router.get("/all", getAllMoods);
router.post("/save", auth, saveUserMoods);

module.exports = router;
