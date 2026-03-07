const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

  enrollment_id: String,

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  enrolled_at: {
    type: Date,
    default: Date.now
  },

  completion_percentage: {
    type: Number,
    default: 0
  },

  status: String,

  last_accessed: Date

});

module.exports = mongoose.model("Enrollment", enrollmentSchema);