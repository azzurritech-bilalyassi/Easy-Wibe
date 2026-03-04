// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const { getQuestions, submitQuiz } = require("../controllers/quizController");

const { auth } = require("../middleware/authMiddleware");

router.get("/questions", auth, getQuestions);
router.post("/submit", auth, submitQuiz);

module.exports = router;
