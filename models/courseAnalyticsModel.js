const mongoose = require("mongoose");

const courseAnalyticsSchema = new mongoose.Schema({

  analytics_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  total_students: Number,

  average_rating: Number,

  completion_rate: Number,

  total_revenue: Number,

  total_lessons: Number,

  total_modules: Number,

  updated_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("CourseAnalytics", courseAnalyticsSchema);