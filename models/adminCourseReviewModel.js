const mongoose = require("mongoose");

const adminCourseReviewSchema = new mongoose.Schema({

    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor"
    },

    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

    review_status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    comments: {
        type: String
    }

}, { timestamps: true });

/* INDEX */

adminCourseReviewSchema.index({ review_status: 1 });
adminCourseReviewSchema.index({ course_id: 1 });
adminCourseReviewSchema.index({ instructor_id: 1 });

module.exports = mongoose.model("AdminCourseReview", adminCourseReviewSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for instructor + review status
adminCourseReviewSchema.index({ instructor_id: 1, review_status: 1 });

// Compound index for course + review status
adminCourseReviewSchema.index({ course_id: 1, review_status: 1 });

// Index for sorting by creation date
adminCourseReviewSchema.index({ createdAt: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only pending reviews
adminCourseReviewSchema.index(
{ review_status: 1 },
{ partialFilterExpression: { review_status: "pending" } }
);

// Index only reviews that contain comments
adminCourseReviewSchema.index(
{ comments: 1 },
{ partialFilterExpression: { comments: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get reviews by instructor
adminCourseReviewSchema.statics.getReviewsByInstructor = function(instructorId){
return this.find({ instructor_id: instructorId });
};

// Get pending reviews
adminCourseReviewSchema.statics.getPendingReviews = function(){
return this.find({ review_status: "pending" });
};

// Approve a course review
adminCourseReviewSchema.statics.approveCourseReview = function(reviewId, adminId){
return this.findByIdAndUpdate(
reviewId,
{ review_status: "approved", admin_id: adminId },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: review status summary
adminCourseReviewSchema.statics.reviewStatusSummaryView = function(){
return this.aggregate([
{
$group:{
_id: "$review_status",
total_reviews: { $sum: 1 }
}
}
]);
};

// View: reviews per instructor
adminCourseReviewSchema.statics.reviewsPerInstructorView = function(){
return this.aggregate([
{
$group:{
_id: "$instructor_id",
total_reviews: { $sum: 1 }
}
},
{
$sort:{ total_reviews: -1 }
}
]);
};