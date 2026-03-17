const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  review_id: String,

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  rating: Number,

  review_text: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Review", reviewSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for user review lookup
reviewSchema.index({ user_id:1 });

// Index for course review lookup
reviewSchema.index({ course_id:1 });

// Compound index for user + course reviews
reviewSchema.index({ user_id:1, course_id:1 });

// Index for sorting reviews by date
reviewSchema.index({ created_at:-1 });

// Index for rating based queries
reviewSchema.index({ rating:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index reviews where rating exists
reviewSchema.index(
{ rating:1 },
{ partialFilterExpression:{ rating:{ $exists:true } } }
);

// Index reviews where text exists
reviewSchema.index(
{ review_text:1 },
{ partialFilterExpression:{ review_text:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get reviews by course
reviewSchema.statics.getReviewsByCourse = function(courseId){
return this.find({ course_id:courseId });
};

// Get reviews by user
reviewSchema.statics.getReviewsByUser = function(userId){
return this.find({ user_id:userId });
};

// Get average rating for a course
reviewSchema.statics.getAverageRating = function(courseId){
return this.aggregate([
{
$match:{ course_id:courseId }
},
{
$group:{
_id:"$course_id",
average_rating:{ $avg:"$rating" }
}
}
]);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: rating distribution per course
reviewSchema.statics.ratingDistributionView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
average_rating:{ $avg:"$rating" },
total_reviews:{ $sum:1 }
}
},
{
$sort:{ average_rating:-1 }
}
]);
};

// View: top rated courses
reviewSchema.statics.topRatedCoursesView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
avg_rating:{ $avg:"$rating" }
}
},
{
$sort:{ avg_rating:-1 }
}
]);
};