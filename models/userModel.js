const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  user_id: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  password_hash: String,

  phone_number: String,

  status: {
    type: String,
    default: "active"
  },

  bio: String,

  profile_picture: String,

  xp_points: {
    type: Number,
    default: 0
  },

  joined_at: {
    type: Date,
    default: Date.now
  },

  last_login: Date,

  // RELATION WITH COURSES

  enrolled_courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],

  wishlist_courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],

  completed_courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]

});

module.exports = mongoose.model("User", userSchema);