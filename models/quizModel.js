const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({

  quiz_id: {
    type: String,
    required: true
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  },

  title: String,

  questions: [String],

  options: [[String]],

  correct_answer: [String],

  total_questions: Number,

  passing_score: Number,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Quiz", quizSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for course quiz lookup
quizSchema.index({ course_id:1 });

// Index for module quiz lookup
quizSchema.index({ module_id:1 });

// Compound index for course + module quizzes
quizSchema.index({ course_id:1, module_id:1 });

// Index for sorting quizzes by creation date
quizSchema.index({ created_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index quizzes where total_questions exists
quizSchema.index(
{ total_questions:1 },
{ partialFilterExpression:{ total_questions:{ $exists:true } } }
);

// Index quizzes where passing_score exists
quizSchema.index(
{ passing_score:1 },
{ partialFilterExpression:{ passing_score:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get quizzes by course
quizSchema.statics.getQuizzesByCourse = function(courseId){
return this.find({ course_id:courseId });
};

// Get quizzes by module
quizSchema.statics.getQuizzesByModule = function(moduleId){
return this.find({ module_id:moduleId });
};

// Get quiz by title
quizSchema.statics.getQuizByTitle = function(title){
return this.findOne({ title:title });
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: number of quizzes per course
quizSchema.statics.quizzesPerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
total_quizzes:{ $sum:1 }
}
},
{
$sort:{ total_quizzes:-1 }
}
]);
};

// View: quiz difficulty summary
quizSchema.statics.quizDifficultyView = function(){
return this.aggregate([
{
$project:{
title:1,
total_questions:1,
passing_score:1,
created_at:1
}
}
]);
};