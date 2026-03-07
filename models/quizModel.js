const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({

  quiz_id: {
    type: String,
    required: true
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  },

  title: String,

  questions: [String],

  options: [[String]],

  correct_answer: [String],

  total_questions: Number,

  passing_score: Number,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Quiz", quizSchema);