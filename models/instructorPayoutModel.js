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


/* =====================================================
Index Optimization
===================================================== */

// Index for instructor payout lookup
instructorPayoutSchema.index({ instructor_id: 1 });

// Index for payout status filtering
instructorPayoutSchema.index({ status: 1 });

// Index for sorting payouts by request date
instructorPayoutSchema.index({ requested_at: -1 });

// Index for transaction lookup
instructorPayoutSchema.index({ transaction_id: 1 });

// Compound index for instructor + status queries
instructorPayoutSchema.index({ instructor_id: 1, status: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only pending payouts
instructorPayoutSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: "pending" } }
);

// Index payouts that have a transaction id
instructorPayoutSchema.index(
  { transaction_id: 1 },
  { partialFilterExpression: { transaction_id: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get payouts by instructor
instructorPayoutSchema.statics.getPayoutsByInstructor = function(instructorId) {
  return this.find({ instructor_id: instructorId });
};

// Get pending payouts
instructorPayoutSchema.statics.getPendingPayouts = function() {
  return this.find({ status: "pending" });
};

// Mark payout as processed
instructorPayoutSchema.statics.processPayout = function(payoutId, transactionId) {
  return this.findOneAndUpdate(
    { payout_id: payoutId },
    { status: "processed", transaction_id: transactionId, processed_at: new Date() },
    { new: true }
  );
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: total payouts per instructor
instructorPayoutSchema.statics.payoutsPerInstructorView = function() {
  return this.aggregate([
    {
      $group: {
        _id: "$instructor_id",
        instructor_name: { $first: "$instructor_name" },
        total_payout: { $sum: "$amount" },
        total_transactions: { $sum: 1 }
      }
    },
    {
      $sort: { total_payout: -1 }
    }
  ]);
};

// View: payout status summary
instructorPayoutSchema.statics.payoutStatusSummaryView = function() {
  return this.aggregate([
    {
      $group: {
        _id: "$status",
        total_payouts: { $sum: 1 },
        total_amount: { $sum: "$amount" }
      }
    }
  ]);
};