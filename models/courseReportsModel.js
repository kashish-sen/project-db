const mongoose = require("mongoose");

const courseReportsSchema = new mongoose.Schema({

report_id:{
type:String,
required:true,
unique:true
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

user_id:{
type:String,
required:true
},

reason:{
type:String,
required:true
},

description:{
type:String
},

status:{
type:String,
enum:["pending","reviewed","resolved","rejected"],
default:"pending"
},

reported_at:{
type:Date,
default:Date.now
},

reviewed_by:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

reviewed_at:{
type:Date
}

});


/* =====================================================
Index Optimization
===================================================== */

// Search reports by course
courseReportsSchema.index({ course_id: 1 });

// Search reports by user
courseReportsSchema.index({ user_id: 1 });

// Status filtering
courseReportsSchema.index({ status: 1 });

// Sorting by report date
courseReportsSchema.index({ reported_at: -1 });

// Compound index for admin dashboards
courseReportsSchema.index({ status: 1, reported_at: -1 });

// Text search
courseReportsSchema.index({ reason: "text", description: "text" });



/* =====================================================
Partial Indexing
===================================================== */

// Only index pending reports for faster moderation queries
courseReportsSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "pending" } }
);


// Partial index for recently reported courses
courseReportsSchema.index(
{ reported_at: -1 },
{ partialFilterExpression: { status: { $in:["pending","reviewed"] } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get all pending reports
courseReportsSchema.statics.getPendingReports = async function(){
return this.find({ status:"pending" });
};


// Get reports for a specific course
courseReportsSchema.statics.getReportsByCourse = async function(courseId){
return this.find({ course_id: courseId });
};


// Resolve report
courseReportsSchema.statics.resolveReport = async function(reportId, adminId){

return this.findOneAndUpdate(
{ report_id: reportId },
{
status:"resolved",
reviewed_by:adminId,
reviewed_at:new Date()
},
{ new:true }

);

};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Course report summary
courseReportsSchema.statics.courseReportSummaryView = async function(){

return this.aggregate([

{
$group:{
_id:"$status",
total_reports:{ $sum:1 }
}
},

{
$project:{
status:"$_id",
total_reports:1,
_id:0
}
}

]);

};


// Reports per course view
courseReportsSchema.statics.reportsPerCourseView = async function(){

return this.aggregate([

{
$group:{
_id:"$course_id",
total_reports:{ $sum:1 }
}
},

{
$sort:{ total_reports:-1 }
}

]);

};


module.exports = mongoose.model("CourseReports", courseReportsSchema);