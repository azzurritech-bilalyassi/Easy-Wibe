// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const {
  getQuestions,
  submitQuiz,
  getTieQuestion,
  submitTieAnswer,
} = require("../controllers/quizController");

const { auth } = require("../middleware/authMiddleware");

router.get("/questions", auth, getQuestions);
router.post("/submit", auth, submitQuiz);

router.post("/tie-question", auth, getTieQuestion);
// router.post("/tie-submit", auth, submitTieAnswer);

module.exports = router;
