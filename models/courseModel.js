const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

  course_id: {
    type: String,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  description: String,

  category: String,

  difficulty_level: String,

  language: String,

  price: Number,

  duration_hours: Number,

  total_modules: Number,

  total_lessons: Number,

  rating: {
    type: Number,
    default: 0
  },

  total_students: {
    type: Number,
    default: 0
  },

  course_status: {
    type: String,
    default: "active"
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  // instructor relation
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  // admin relation (who approved)
  approved_by_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

});

module.exports = mongoose.model("Course", courseSchema);