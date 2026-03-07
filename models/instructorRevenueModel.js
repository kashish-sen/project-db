const mongoose = require("mongoose");

const instructorRevenueSchema = new mongoose.Schema({

  revenue_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  instructor_name: String,

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  },

  total_amount: Number,

  platform_commission: Number,

  instructor_earning: Number,

  currency: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("InstructorRevenue", instructorRevenueSchema);