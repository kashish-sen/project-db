const mongoose = require("mongoose");

const userDashboardSchema = new mongoose.Schema({

  dashboard_id: {
    type: String,
    required: true
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  total_enrolled_courses: {
    type: Number,
    default: 0
  },

  completed_courses: {
    type: Number,
    default: 0
  },

  wishlist_count: {
    type: Number,
    default: 0
  },

  certificates_earned: {
    type: Number,
    default: 0
  },

  total_learning_hours: {
    type: Number,
    default: 0
  },

  total_spent: {
    type: Number,
    default: 0
  },

  recent_course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  last_login: Date,

  updated_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("UserDashboard", userDashboardSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for user dashboard lookup
userDashboardSchema.index({ user_id:1 });

// Index for sorting dashboards by last login
userDashboardSchema.index({ last_login:-1 });

// Index for recent course queries
userDashboardSchema.index({ recent_course:1 });

// Index for tracking updates
userDashboardSchema.index({ updated_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index dashboards where completed courses exist
userDashboardSchema.index(
{ completed_courses:1 },
{ partialFilterExpression:{ completed_courses:{ $gt:0 } } }
);

// Index dashboards where spending exists
userDashboardSchema.index(
{ total_spent:1 },
{ partialFilterExpression:{ total_spent:{ $gt:0 } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get dashboard by user
userDashboardSchema.statics.getDashboardByUser = function(userId){
return this.findOne({ user_id:userId });
};

// Update dashboard statistics
userDashboardSchema.statics.updateDashboardStats = function(userId,data){
return this.findOneAndUpdate(
{ user_id:userId },
{ $set:data, updated_at:new Date() },
{ new:true }
);
};

// Get top learners by learning hours
userDashboardSchema.statics.getTopLearners = function(){
return this.find().sort({ total_learning_hours:-1 }).limit(10);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: user learning summary
userDashboardSchema.statics.userLearningSummaryView = function(){
return this.aggregate([
{
$project:{
user_id:1,
total_enrolled_courses:1,
completed_courses:1,
total_learning_hours:1,
total_spent:1
}
}
]);
};

// View: top spenders
userDashboardSchema.statics.topSpendersView = function(){
return this.aggregate([
{
$sort:{ total_spent:-1 }
},
{
$project:{
user_id:1,
total_spent:1,
total_enrolled_courses:1
}
}
]);
};