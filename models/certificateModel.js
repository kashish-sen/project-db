const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificate_id: String,
  user_id: String,
  course_id: String,
  certificate_url: String,
  issued_at: Date
});

module.exports = mongoose.model("Certificate", certificateSchema);