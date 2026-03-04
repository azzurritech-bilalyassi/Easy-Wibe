// models/UserAnswer.js
const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  selectedOption: { type: String, required: true } // value of the option
}, { timestamps: true });

module.exports = mongoose.model("UserAnswer", userAnswerSchema);