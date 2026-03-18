// controllers/quizController.js

const Question = require("../models/Question");
const Answer = require("../models/Answer");

// ðŸ”¹ Get Questions

const getQuestions = async (req, res) => {
  try {
    // Fetch only questions that are NOT tie-breakers
    const questions = await Question.find({
      category: { $ne: "SPAREGGIO" }, // exclude tie-break questions
    }).sort({ order: 1 }); // ensure correct order

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

const getTieQuestion = async (req, res) => {
  try {
    const { personalities } = req.body; // ["A","C"]
    if (!personalities || personalities.length < 2) {
      return res.status(400).json({ message: "Provide at least 2 personalities" });
    }

    const sortedPersonalities = personalities.map(p => p.toUpperCase());

    // Fetch tie-break questions
    const questions = await Question.find({ category: "SPAREGGIO" });

    // Filter manually to match ALL personalities
    const question = questions.find(q => {
      const optionPersonalities = q.options.map(o => o.personality);
      return sortedPersonalities.every(p => optionPersonalities.includes(p));
    });

    if (!question) {
      return res.status(404).json({ message: "Tie question not found" });
    }

    res.json({
      success: true,
      data: [question],  
    });
  } catch (err) {
    console.error("getTieQuestion Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// const submitTieAnswer = async (req, res) => {
//   try {
//     const { questionId, optionId } = req.body;

//     const question = await Question.findById(questionId);

//     const option = question.options.id(optionId);

//     if (!option) {
//       return res.status(400).json({
//         message: "Invalid option",
//       });
//     }

//     const result = option.personality;

//     res.json({
//       success: true,
//       result,
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

module.exports = { getQuestions, submitQuiz, getTieQuestion };
