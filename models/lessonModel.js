const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({

  lesson_id: {
    type: String,
    required: true
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },

  lesson_title: String,

  video_url: String,

  duration_minutes: Number,

  lesson_order: Number,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Lesson", lessonSchema);