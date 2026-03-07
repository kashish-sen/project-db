const mongoose = require("mongoose");

const instructorCoursesSchema = new mongoose.Schema({

  instructor_course_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  instructor_name: String,

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  course_title: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("InstructorCourse", instructorCoursesSchema);