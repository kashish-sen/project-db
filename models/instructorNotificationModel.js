const mongoose = require("mongoose");

const instructorNotificationSchema = new mongoose.Schema({

  notification_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  message: String,

  read_status: {
    type: Boolean,
    default: false
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("InstructorNotification", instructorNotificationSchema);