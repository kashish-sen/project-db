const mongoose = require("mongoose");

const adminCourseReviewSchema = new mongoose.Schema({

  review_id: String,

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  review_status: String,

  review_notes: String,

  reviewed_at: Date,

  submitted_at: Date

});

module.exports = mongoose.model("AdminCourseReview", adminCourseReviewSchema);