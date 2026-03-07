const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  progress_id: String,
  user_id: String,
  course_id: String,
  module_id: String,
  lesson_id: String,
  completed: Boolean,
  completion_time: Number,
  updated_at: Date
});

module.exports = mongoose.model("Progress", progressSchema);