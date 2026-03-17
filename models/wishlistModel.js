const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  wishlist_id: String,
  user_id: String,
  course_id: String,
  added_at: Date
});

module.exports = mongoose.model("Wishlist", wishlistSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for user wishlist lookup
wishlistSchema.index({ user_id:1 });

// Index for course wishlist lookup
wishlistSchema.index({ course_id:1 });

// Compound index for user + course wishlist
wishlistSchema.index({ user_id:1, course_id:1 });

// Index for sorting wishlist by added date
wishlistSchema.index({ added_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index records where course exists
wishlistSchema.index(
{ course_id:1 },
{ partialFilterExpression:{ course_id:{ $exists:true } } }
);

// Index records where user exists
wishlistSchema.index(
{ user_id:1 },
{ partialFilterExpression:{ user_id:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get wishlist by user
wishlistSchema.statics.getWishlistByUser = function(userId){
return this.find({ user_id:userId });
};

// Check if a course is in wishlist
wishlistSchema.statics.isCourseInWishlist = function(userId,courseId){
return this.findOne({ user_id:userId, course_id:courseId });
};

// Remove course from wishlist
wishlistSchema.statics.removeFromWishlist = function(wishlistId){
return this.findOneAndDelete({ wishlist_id:wishlistId });
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: most wishlisted courses
wishlistSchema.statics.mostWishlistedCoursesView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
total_wishlist:{ $sum:1 }
}
},
{
$sort:{ total_wishlist:-1 }
}
]);
};

// View: wishlist count per user
wishlistSchema.statics.wishlistPerUserView = function(){
return this.aggregate([
{
$group:{
_id:"$user_id",
total_courses:{ $sum:1 }
}
},
{
$sort:{ total_courses:-1 }
}
]);
};