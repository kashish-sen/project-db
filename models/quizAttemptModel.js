const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  attempt_id: String,
  user_id: String,
  quiz_id: String,
  course_id: String,
  score: Number,
  attempt_number: Number,
  completed_at: Date
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for user quiz attempts
quizAttemptSchema.index({ user_id:1 });

// Index for quiz lookup
quizAttemptSchema.index({ quiz_id:1 });

// Index for course quiz attempts
quizAttemptSchema.index({ course_id:1 });

// Compound index for user + quiz attempts
quizAttemptSchema.index({ user_id:1, quiz_id:1 });

// Index for sorting attempts by completion date
quizAttemptSchema.index({ completed_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index records where score exists
quizAttemptSchema.index(
{ score:1 },
{ partialFilterExpression:{ score:{ $exists:true } } }
);

// Index attempts where attempt number exists
quizAttemptSchema.index(
{ attempt_number:1 },
{ partialFilterExpression:{ attempt_number:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get quiz attempts by user
quizAttemptSchema.statics.getAttemptsByUser = function(userId){
return this.find({ user_id:userId });
};

// Get attempts for a quiz
quizAttemptSchema.statics.getAttemptsByQuiz = function(quizId){
return this.find({ quiz_id:quizId });
};

// Get best score for a user in a quiz
quizAttemptSchema.statics.getBestScore = function(userId,quizId){
return this.find({ user_id:userId, quiz_id:quizId })
.sort({ score:-1 })
.limit(1);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: average quiz score per course
quizAttemptSchema.statics.averageScorePerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
average_score:{ $avg:"$score" },
total_attempts:{ $sum:1 }
}
},
{
$sort:{ average_score:-1 }
}
]);
};

// View: top quiz performers
quizAttemptSchema.statics.topQuizPerformersView = function(){
return this.aggregate([
{
$group:{
_id:"$user_id",
highest_score:{ $max:"$score" }
}
},
{
$sort:{ highest_score:-1 }
}
]);
};