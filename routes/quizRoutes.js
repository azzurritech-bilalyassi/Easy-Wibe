const express = require("express");
const router = express.Router();
const {
  getQuestions,
  submitAnswer,
  submitQuiz,
  getResult,
} = require("../controllers/quizController");
const { auth } = require("../middleware/authMiddleware");

// Protected routes, user must be logged in
router.get("/questions", auth, getQuestions);
router.post("/answer", auth, submitAnswer);
router.post("/submit", auth, submitQuiz);
router.get("/result", auth, getResult);

module.exports = router;
