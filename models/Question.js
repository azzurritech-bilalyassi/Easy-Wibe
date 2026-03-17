const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },

  personality: {
    type: String,
    required: true,
  },

  // points: {
  //   type: Number,
  //   default: 2,
  // },
  weights: {
    A: { type: Number, default: 0 },
    B: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    D: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    F: { type: Number, default: 0 },
    G: { type: Number, default: 0 },
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
