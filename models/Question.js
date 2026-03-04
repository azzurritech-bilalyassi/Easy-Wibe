// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,      // Option text
      value: String      // Mood value: e.g., "Happy", "Sad", "Party"
    }
  ],
  order: { type: Number, required: true } // Question order
});

module.exports = mongoose.model("Question", questionSchema);