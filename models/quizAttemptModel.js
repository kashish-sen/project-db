const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  attempt_id: String,
  user_id: String,
  quiz_id: String,
  course_id: String,
  score: Number,
  attempt_number: Number,
  completed_at: Date
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);