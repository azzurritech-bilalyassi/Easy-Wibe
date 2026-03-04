const Question = require("../models/Question");
const User = require("../models/User");
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
      { userId: req.user.id, questionId },
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
    const answers = await UserAnswer.find({ userId: req.user.id }).populate(
      "questionId",
    );

    if (answers.length < 6) {
      return res.status(400).json({ message: "Quiz non completato" });
    }

    const profile = {
      energy: null,
      social: null,
      novelty: null,
      environment: null,
      leadership: null,
      motivation: null,
    };

    // Case-insensitive aur safe matching
    answers.forEach((ans) => {
      const cat = ans.questionId?.category?.trim(); // null/undefined se bachao

      if (!cat) return; // agar category nahi mila to skip

      const catLower = cat.toLowerCase();

      if (catLower.includes("energia")) profile.energy = ans.selectedOption;
      if (catLower.includes("social")) profile.social = ans.selectedOption;
      if (catLower.includes("novità") || catLower.includes("novita"))
        profile.novelty = ans.selectedOption;
      if (catLower.includes("ambiente"))
        profile.environment = ans.selectedOption;
      if (catLower.includes("gruppo")) profile.leadership = ans.selectedOption;
      if (catLower.includes("identità") || catLower.includes("identita"))
        profile.motivation = ans.selectedOption;
    });

    // Basic validation – important categories check
    if (!profile.energy || !profile.social) {
      return res.status(400).json({
        message: "Alcune risposte mancanti o non valide",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mood calculation (sirf tumhare diye hue rules + default)
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

    // Save to user
    user.moodResult = mood;
    user.isOnboarded = true;
    await user.save();

    res.json({
      message: "Quiz completato!",
      mood,
    });
  } catch (err) {
    console.error("SubmitQuiz Error:", err.message);
    res.status(500).json({ message: "Errore server, riprova più tardi" });
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
