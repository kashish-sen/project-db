const mongoose = require("mongoose");

const courseResourcesSchema = new mongoose.Schema({

  resource_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  },

  resource_title: String,

  file_url: String,

  file_type: String,

  uploaded_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("CourseResource", courseResourcesSchema);