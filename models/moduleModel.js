const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({

  module_id: {
    type: String,
    required: true
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  module_title: String,

  module_description: String,

  module_order: Number,

  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Module", moduleSchema);