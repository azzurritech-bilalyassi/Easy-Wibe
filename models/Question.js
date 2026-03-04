// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
 question: { type: String, required: true },
  category: { type: String, required: true }, 
  options: [
    {
      text: { type: String, required: true },
      value: { type: String, required: true, unique: false },
    },
  ],
  order: { type: Number, required: true, unique: true },
});

module.exports = mongoose.model("Question", questionSchema);
