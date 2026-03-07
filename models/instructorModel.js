const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({

  instructor_id: {
    type: String,
    required: true
  },

  instructor_name: String,

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  email: String,

  phone_number: String,

  expertise: String,

  experience_years: Number,

  education: String,

  bio: String,

  linkedin: String,

  portfolio: String,

  profile_picture: String,

  rating: {
    type: Number,
    default: 0
  },

  total_students: {
    type: Number,
    default: 0
  },

  total_courses: {
    type: Number,
    default: 0
  },

  verified: {
    type: Boolean,
    default: false
  },

  // Admin approval workflow
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  approved_by_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Instructor", instructorSchema);