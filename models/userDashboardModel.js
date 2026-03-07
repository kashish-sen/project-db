const mongoose = require("mongoose");

const userDashboardSchema = new mongoose.Schema({

  dashboard_id: {
    type: String,
    required: true
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  total_enrolled_courses: {
    type: Number,
    default: 0
  },

  completed_courses: {
    type: Number,
    default: 0
  },

  wishlist_count: {
    type: Number,
    default: 0
  },

  certificates_earned: {
    type: Number,
    default: 0
  },

  total_learning_hours: {
    type: Number,
    default: 0
  },

  total_spent: {
    type: Number,
    default: 0
  },

  recent_course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  last_login: Date,

  updated_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("UserDashboard", userDashboardSchema);