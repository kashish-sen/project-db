const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  payment_id: String,

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  amount: Number,

  currency: String,

  payment_gateway: String,

  transaction_id: String,

  payment_method: String,

  status: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Payment", paymentSchema);