const mongoose = require("mongoose");

const studentAnalyticsSchema = new mongoose.Schema({

  analytics_id: String,

  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  user_name: String,

  progress_percentage: Number,

  quiz_score: Number,

  lessons_completed: Number,

  last_active: Date

});

module.exports = mongoose.model("StudentAnalytics", studentAnalyticsSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for instructor analytics lookup
studentAnalyticsSchema.index({ instructor_id:1 });

// Index for course analytics
studentAnalyticsSchema.index({ course_id:1 });

// Index for student analytics
studentAnalyticsSchema.index({ user_id:1 });

// Compound index for instructor + course queries
studentAnalyticsSchema.index({ instructor_id:1, course_id:1 });

// Index for tracking last active students
studentAnalyticsSchema.index({ last_active:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index records where progress exists
studentAnalyticsSchema.index(
{ progress_percentage:1 },
{ partialFilterExpression:{ progress_percentage:{ $exists:true } } }
);

// Index records where quiz score exists
studentAnalyticsSchema.index(
{ quiz_score:1 },
{ partialFilterExpression:{ quiz_score:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get analytics by instructor
studentAnalyticsSchema.statics.getAnalyticsByInstructor = function(instructorId){
return this.find({ instructor_id:instructorId });
};

// Get analytics for a course
studentAnalyticsSchema.statics.getAnalyticsByCourse = function(courseId){
return this.find({ course_id:courseId });
};

// Get analytics for a student
studentAnalyticsSchema.statics.getAnalyticsByStudent = function(userId){
return this.find({ user_id:userId });
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: average progress per course
studentAnalyticsSchema.statics.averageProgressPerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
average_progress:{ $avg:"$progress_percentage" },
total_students:{ $sum:1 }
}
},
{
$sort:{ average_progress:-1 }
}
]);
};

// View: student engagement summary
studentAnalyticsSchema.statics.studentEngagementView = function(){
return this.aggregate([
{
$group:{
_id:"$user_id",
total_lessons_completed:{ $sum:"$lessons_completed" },
average_quiz_score:{ $avg:"$quiz_score" }
}
},
{
$sort:{ total_lessons_completed:-1 }
}
]);
};