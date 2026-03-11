const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },

  personality: {
    type: String,
    required: true,
  },

  points: {
    type: Number,
    default: 2,
  },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },

  category: {
    type: String,
    required: true,
  },

  options: [optionSchema],

  order: { type: Number, required: true, unique: true },

  // isTieBreaker: {
  //   type: Boolean,
  //   default: false,
  // },
});

module.exports = mongoose.model("Question", questionSchema);
