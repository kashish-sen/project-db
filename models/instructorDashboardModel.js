const mongoose = require("mongoose");

const instructorDashboardSchema = new mongoose.Schema({

  dashboard_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  total_courses: Number,

  total_students: Number,

  total_revenue: Number,

  average_rating: Number,

  total_lessons: Number,

  total_modules: Number,

  total_quizzes: Number,

  last_updated: Date

});

module.exports = mongoose.model("InstructorDashboard", instructorDashboardSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for instructor lookup
instructorDashboardSchema.index({ instructor_id: 1 });

// Index for sorting by revenue
instructorDashboardSchema.index({ total_revenue: -1 });

// Index for rating queries
instructorDashboardSchema.index({ average_rating: -1 });

// Index for last updated dashboards
instructorDashboardSchema.index({ last_updated: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index dashboards where revenue exists
instructorDashboardSchema.index(
  { total_revenue: -1 },
  { partialFilterExpression: { total_revenue: { $exists: true } } }
);

// Index dashboards where rating exists
instructorDashboardSchema.index(
  { average_rating: -1 },
  { partialFilterExpression: { average_rating: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get dashboard by instructor
instructorDashboardSchema.statics.getDashboardByInstructor = function(instructorId) {
  return this.findOne({ instructor_id: instructorId });
};

// Update instructor dashboard metrics
instructorDashboardSchema.statics.updateDashboardStats = function(instructorId, data) {
  return this.findOneAndUpdate(
    { instructor_id: instructorId },
    { $set: data },
    { new: true }
  );
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: Top instructors by revenue
instructorDashboardSchema.statics.topInstructorsByRevenueView = function() {
  return this.aggregate([
    {
      $sort: { total_revenue: -1 }
    },
    {
      $project: {
        instructor_id: 1,
        total_revenue: 1,
        total_students: 1,
        average_rating: 1
      }
    }
  ]);
};

// View: Instructor performance summary
instructorDashboardSchema.statics.instructorPerformanceView = function() {
  return this.aggregate([
    {
      $group: {
        _id: "$instructor_id",
        total_courses: { $first: "$total_courses" },
        total_students: { $first: "$total_students" },
        total_revenue: { $first: "$total_revenue" },
        average_rating: { $first: "$average_rating" }
      }
    }
  ]);
};