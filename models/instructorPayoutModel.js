const mongoose = require("mongoose");

const instructorPayoutSchema = new mongoose.Schema({

  payout_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  instructor_name: String,

  amount: Number,

  currency: String,

  payment_method: String,

  transaction_id: String,

  status: String,

  requested_at: Date,

  processed_at: Date

});

module.exports = mongoose.model("InstructorPayout", instructorPayoutSchema);