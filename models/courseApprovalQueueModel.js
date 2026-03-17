const mongoose = require("mongoose");

const courseApprovalSchema = new mongoose.Schema({

approval_id:{
type:String,
required:true
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor",
required:true
},

status:{
type:String,
enum:["pending","approved","rejected"],
default:"pending",
required:true
},

review_notes:String,

reviewed_by:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

reviewed_at:Date,

submitted_at:{
type:Date,
default:Date.now
}

});

/* INDEX OPTIMIZATION */

courseApprovalSchema.index({ course_id:1 });
courseApprovalSchema.index({ instructor_id:1 });
courseApprovalSchema.index({ status:1 });

module.exports = mongoose.model("CourseApprovalQueue", courseApprovalSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for instructor + status queries
courseApprovalSchema.index({ instructor_id:1, status:1 });

// Index for sorting approvals by submission time
courseApprovalSchema.index({ submitted_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only pending approvals
courseApprovalSchema.index(
{ status:1 },
{ partialFilterExpression:{ status:"pending" } }
);

// Index approvals where review notes exist
courseApprovalSchema.index(
{ review_notes:1 },
{ partialFilterExpression:{ review_notes:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get approvals by instructor
courseApprovalSchema.statics.getApprovalsByInstructor = function(instructorId){
return this.find({ instructor_id:instructorId });
};

// Get pending approvals
courseApprovalSchema.statics.getPendingApprovals = function(){
return this.find({ status:"pending" });
};

// Approve course
courseApprovalSchema.statics.approveCourse = function(approvalId,adminId){
return this.findOneAndUpdate(
{ approval_id:approvalId },
{ status:"approved", reviewed_by:adminId, reviewed_at:new Date() },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: approvals per instructor
courseApprovalSchema.statics.approvalsPerInstructorView = function(){
return this.aggregate([
{
$group:{
_id:"$instructor_id",
total_submissions:{ $sum:1 }
}
},
{
$sort:{ total_submissions:-1 }
}
]);
};

// View: approval status summary
courseApprovalSchema.statics.approvalStatusSummaryView = function(){
return this.aggregate([
{
$group:{
_id:"$status",
total:{ $sum:1 }
}
}
]);
};