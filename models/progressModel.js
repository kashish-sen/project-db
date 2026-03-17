const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  progress_id: String,
  user_id: String,
  course_id: String,
  module_id: String,
  lesson_id: String,
  completed: Boolean,
  completion_time: Number,
  updated_at: Date
});

module.exports = mongoose.model("Progress", progressSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for user progress lookup
progressSchema.index({ user_id:1 });

// Index for course progress tracking
progressSchema.index({ course_id:1 });

// Index for module progress tracking
progressSchema.index({ module_id:1 });

// Index for lesson progress tracking
progressSchema.index({ lesson_id:1 });

// Compound index for user + course queries
progressSchema.index({ user_id:1, course_id:1 });

// Index for latest progress updates
progressSchema.index({ updated_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only completed lessons
progressSchema.index(
{ completed:1 },
{ partialFilterExpression:{ completed:true } }
);

// Index records where completion_time exists
progressSchema.index(
{ completion_time:1 },
{ partialFilterExpression:{ completion_time:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get progress by user
progressSchema.statics.getProgressByUser = function(userId){
return this.find({ user_id:userId });
};

// Get progress for a course
progressSchema.statics.getCourseProgress = function(userId,courseId){
return this.find({ user_id:userId, course_id:courseId });
};

// Mark lesson as completed
progressSchema.statics.markLessonCompleted = function(progressId,time){
return this.findOneAndUpdate(
{ progress_id:progressId },
{ completed:true, completion_time:time, updated_at:new Date() },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: course completion stats
progressSchema.statics.courseCompletionView = function(){
return this.aggregate([
{
$match:{ completed:true }
},
{
$group:{
_id:"$course_id",
completed_lessons:{ $sum:1 }
}
},
{
$sort:{ completed_lessons:-1 }
}
]);
};

// View: user learning progress
progressSchema.statics.userProgressView = function(){
return this.aggregate([
{
$group:{
_id:"$user_id",
total_lessons_completed:{ $sum:{ $cond:["$completed",1,0] } }
}
},
{
$sort:{ total_lessons_completed:-1 }
}
]);
};