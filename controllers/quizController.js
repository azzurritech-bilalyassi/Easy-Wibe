const Question = require("../models/Question");
const UserAnswer = require("../models/UserAnswer");

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;

    // Update if exists, otherwise create
    const answer = await UserAnswer.findOneAndUpdate(
      { userId: req.user._id, questionId },
      { selectedOption },
      { upsert: true, new: true },
    );

    res.json({ message: "Answer saved", answer });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const answers = await UserAnswer.find({ userId: req.user._id });

    if (answers.length === 0)
      return res.status(400).json({ message: "No answers found" });

    // Mood Calculation: Count frequency of each mood
    const moodCount = {};
    answers.forEach((a) => {
      moodCount[a.selectedOption] = (moodCount[a.selectedOption] || 0) + 1;
    });

    // Select mood with highest count
    const moodResult = Object.keys(moodCount).reduce((a, b) =>
      moodCount[a] > moodCount[b] ? a : b,
    );

    // Save mood result to user
    req.user.moodResult = moodResult;
    req.user.isOnboarded = true;
    await req.user.save();

    res.json({ message: "Quiz completed", moodResult });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getResult = async (req, res) => {
  try {
    if (!req.user.moodResult)
      return res.status(404).json({ message: "No result found" });
    res.json({ moodResult: req.user.moodResult });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getQuestions, submitAnswer, submitQuiz, getResult };
