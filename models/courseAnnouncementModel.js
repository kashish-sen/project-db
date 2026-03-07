const mongoose = require("mongoose");

const courseAnnouncementSchema = new mongoose.Schema({

  announcement_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  title: String,

  message: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("CourseAnnouncement", courseAnnouncementSchema);