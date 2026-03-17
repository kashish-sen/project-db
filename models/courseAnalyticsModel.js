const mongoose = require("mongoose");

const courseAnalyticsSchema = new mongoose.Schema({

analytics_id:{
type:String,
required:true
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
},

total_students:{
type:Number,
default:0
},

average_rating:{
type:Number,
min:0,
max:5
},

completion_rate:{
type:Number,
min:0,
max:100
},

total_revenue:{
type:Number,
min:0
},

total_lessons:Number,

total_modules:Number,

updated_at:{
type:Date,
default:Date.now
}

});

/* INDEX OPTIMIZATION */

courseAnalyticsSchema.index({ course_id:1 });
courseAnalyticsSchema.index({ instructor_id:1 });

module.exports = mongoose.model("CourseAnalytics", courseAnalyticsSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for instructor + course analytics
courseAnalyticsSchema.index({ instructor_id:1, course_id:1 });

// Index for sorting analytics updates
courseAnalyticsSchema.index({ updated_at:-1 });

// Index for revenue based analytics queries
courseAnalyticsSchema.index({ total_revenue:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index records where completion rate exists
courseAnalyticsSchema.index(
{ completion_rate:1 },
{ partialFilterExpression:{ completion_rate:{ $exists:true } } }
);

// Index records where average rating exists
courseAnalyticsSchema.index(
{ average_rating:1 },
{ partialFilterExpression:{ average_rating:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get analytics by course
courseAnalyticsSchema.statics.getAnalyticsByCourse = function(courseId){
return this.findOne({ course_id:courseId });
};

// Get analytics by instructor
courseAnalyticsSchema.statics.getAnalyticsByInstructor = function(instructorId){
return this.find({ instructor_id:instructorId });
};

// Update course analytics
courseAnalyticsSchema.statics.updateAnalytics = function(courseId,data){
return this.findOneAndUpdate(
{ course_id:courseId },
{ $set:data, updated_at:new Date() },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: top courses by revenue
courseAnalyticsSchema.statics.topCoursesByRevenueView = function(){
return this.aggregate([
{
$sort:{ total_revenue:-1 }
},
{
$project:{
course_id:1,
total_students:1,
total_revenue:1,
average_rating:1
}
}
]);
};

// View: instructor performance summary
courseAnalyticsSchema.statics.instructorCoursePerformanceView = function(){
return this.aggregate([
{
$group:{
_id:"$instructor_id",
total_courses:{ $sum:1 },
total_students:{ $sum:"$total_students" },
total_revenue:{ $sum:"$total_revenue" }
}
},
{
$sort:{ total_revenue:-1 }
}
]);
};