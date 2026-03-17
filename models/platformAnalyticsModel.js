const mongoose = require("mongoose");

const platformAnalyticsSchema = new mongoose.Schema({

analytics_id:String,

total_users:Number,

total_instructors:Number,

total_courses:Number,

total_enrollments:Number,

total_revenue:Number,

active_users:Number,

active_courses:Number,

average_course_rating:Number,

updated_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("PlatformAnalytics",platformAnalyticsSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for analytics id lookup
platformAnalyticsSchema.index({ analytics_id:1 });

// Index for latest analytics updates
platformAnalyticsSchema.index({ updated_at:-1 });

// Index for revenue based analytics queries
platformAnalyticsSchema.index({ total_revenue:-1 });

// Index for active user tracking
platformAnalyticsSchema.index({ active_users:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only records where revenue exists
platformAnalyticsSchema.index(
{ total_revenue:1 },
{ partialFilterExpression:{ total_revenue:{ $exists:true } } }
);

// Index only records where active users exist
platformAnalyticsSchema.index(
{ active_users:1 },
{ partialFilterExpression:{ active_users:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get latest analytics record
platformAnalyticsSchema.statics.getLatestAnalytics = function(){
return this.findOne().sort({ updated_at:-1 });
};

// Update analytics data
platformAnalyticsSchema.statics.updateAnalytics = function(analyticsId,data){
return this.findOneAndUpdate(
{ analytics_id:analyticsId },
{ $set:data, updated_at:new Date() },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: platform growth summary
platformAnalyticsSchema.statics.platformGrowthView = function(){
return this.aggregate([
{
$project:{
total_users:1,
total_instructors:1,
total_courses:1,
total_enrollments:1,
total_revenue:1,
updated_at:1
}
}
]);
};

// View: active platform performance
platformAnalyticsSchema.statics.activePlatformMetricsView = function(){
return this.aggregate([
{
$project:{
active_users:1,
active_courses:1,
average_course_rating:1,
updated_at:1
}
}
]);
};