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


/* =====================================================
Index Optimization
===================================================== */

// Index for instructor revenue lookup
instructorRevenueSchema.index({ instructor_id: 1 });

// Index for course revenue tracking
instructorRevenueSchema.index({ course_id: 1 });

// Index for payment reference
instructorRevenueSchema.index({ payment_id: 1 });

// Index for sorting by creation date
instructorRevenueSchema.index({ created_at: -1 });

// Compound index for instructor + course revenue queries
instructorRevenueSchema.index({ instructor_id: 1, course_id: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index documents where instructor earnings exist
instructorRevenueSchema.index(
  { instructor_earning: -1 },
  { partialFilterExpression: { instructor_earning: { $exists: true } } }
);

// Index only documents with payment reference
instructorRevenueSchema.index(
  { payment_id: 1 },
  { partialFilterExpression: { payment_id: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get revenue by instructor
instructorRevenueSchema.statics.getRevenueByInstructor = function(instructorId) {
  return this.find({ instructor_id: instructorId });
};

// Get revenue for a course
instructorRevenueSchema.statics.getRevenueByCourse = function(courseId) {
  return this.find({ course_id: courseId });
};

// Calculate total instructor earnings
instructorRevenueSchema.statics.calculateInstructorEarnings = function(instructorId) {
  return this.aggregate([
    { $match: { instructor_id: instructorId } },
    {
      $group: {
        _id: "$instructor_id",
        total_earning: { $sum: "$instructor_earning" }
      }
    }
  ]);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: revenue summary per instructor
instructorRevenueSchema.statics.revenuePerInstructorView = function() {
  return this.aggregate([
    {
      $group: {
        _id: "$instructor_id",
        instructor_name: { $first: "$instructor_name" },
        total_revenue: { $sum: "$total_amount" },
        total_earning: { $sum: "$instructor_earning" }
      }
    },
    {
      $sort: { total_earning: -1 }
    }
  ]);
};

// View: revenue per course
instructorRevenueSchema.statics.revenuePerCourseView = function() {
  return this.aggregate([
    {
      $group: {
        _id: "$course_id",
        total_revenue: { $sum: "$total_amount" },
        total_platform_commission: { $sum: "$platform_commission" },
        total_instructor_earning: { $sum: "$instructor_earning" }
      }
    },
    {
      $sort: { total_revenue: -1 }
    }
  ]);
};