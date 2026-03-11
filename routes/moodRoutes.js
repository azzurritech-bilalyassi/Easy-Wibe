const express = require("express");
const router = express.Router();
const { getAllMoods } = require("../controllers/moodController");

router.get("/all", getAllMoods);

module.exports = router;
