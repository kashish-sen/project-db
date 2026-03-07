const mongoose = require("mongoose");

const studentAnalyticsSchema = new mongoose.Schema({

  analytics_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  user_name: String,

  progress_percentage: Number,

  quiz_score: Number,

  lessons_completed: Number,

  last_active: Date

});

module.exports = mongoose.model("StudentAnalytics", studentAnalyticsSchema);