const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  review_id: String,

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  rating: Number,

  review_text: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Review", reviewSchema);