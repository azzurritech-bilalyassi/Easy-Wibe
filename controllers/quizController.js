// controllers/quizController.js

const Question = require("../models/Question");
const User = require("../models/User");
const UserAnswer = require("../models/UserAnswer");

// 🔹 Get Questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔥 FINAL SUBMIT (Single API)
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
      selectedOption: ans.selectedOption, // option _id
    }));

    await UserAnswer.insertMany(formattedAnswers);

    // Fetch questions to calculate mood
    const questions = await Question.find({
      _id: { $in: answers.map((a) => a.questionId) },
    });

    // Build profile
    const profile = {};

    answers.forEach((ans) => {
      const question = questions.find(
        (q) => q._id.toString() === ans.questionId,
      );

      if (!question) return;

      const selectedOpt = question.options.id(ans.selectedOption);

      if (!selectedOpt) return;

      profile[question.category] = selectedOpt.value;
    });

    // Validation
    // if (!profile.energy || !profile.social) {
    //   return res.status(400).json({
    //     message: "Missing required answers",
    //   });
    // }

    // 🎯 Mood Logic
    let mood = "Chill Explorer";

    if (profile.energy === "HighEnergy" && profile.social === "Group") {
      mood = "Party Animal";
    }

    if (profile.energy === "LowEnergy" && profile.social === "Alone") {
      mood = "Cozy Night In";
    }

    if (
      profile.environment === "Outdoors" &&
      profile.novelty === "HighNovelty"
    ) {
      mood = "Adventure Seeker";
    }

    if (profile.motivation === "Relax" || profile.motivation === "SelfCare") {
      mood = "Recharge Mode";
    }

    // Update user (optimized)
    await User.findByIdAndUpdate(req.user.id, {
      moodResult: mood,
    });

    res.json({
      message: "Quiz completed successfully",
      mood,
    });
  } catch (err) {
    console.error("SubmitQuiz Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getQuestions, submitQuiz };
