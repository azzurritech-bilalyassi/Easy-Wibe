// controllers/quizController.js

const Question = require("../models/Question");
const Answer = require("../models/Answer");

// ðŸ”¹ Get Questions

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()  
      .sort({ order: 1 }); // correct order

    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (err) {
    console.error("GetQuestions Error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ðŸ”¥ FINAL SUBMIT (Single API)
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length < 5) {
      return res.status(400).json({ message: "Quiz not completed" });
    }

    // Remove old answers (clean re-submission)
    // await UserAnswer.deleteMany({ userId: req.user.id });

    // Save answers
   const formattedAnswers = answers.map((ans) => ({
      userId: req.user.id,
      questionId: ans.questionId,
      optionId: ans.selectedOption,  
    }));

     await Answer.insertMany(formattedAnswers);

    res.json({
      message: "Quiz completed successfully",
    });
  } catch (err) {
    console.error("SubmitQuiz Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getQuestions, submitQuiz };
