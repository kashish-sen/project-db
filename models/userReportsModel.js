const mongoose = require("mongoose");

const userReportsSchema = new mongoose.Schema({

report_id:{
type:String,
required:true,
unique:true
},

user_id:{
type:String,
required:true
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
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
 INDEX OPTIMIZATION
===================================================== */

// Index for searching reports by user
userReportsSchema.index({ user_id: 1 });

// Index for course related reports
userReportsSchema.index({ course_id: 1 });

// Index for status filtering
userReportsSchema.index({ status: 1 });

// Compound index for faster admin filtering
userReportsSchema.index({ status: 1, reported_at: -1 });

// Text search index
userReportsSchema.index({ reason: "text", description: "text" });



/* =====================================================
DATABASE VALIDATION RULES
===================================================== */

// Reason validation
userReportsSchema.path("reason").validate(function(reason){
return reason.length >= 5;
}, "Reason must contain at least 5 characters");


// Description length validation
userReportsSchema.path("description").validate(function(desc){
if(!desc) return true;
return desc.length <= 1000;
}, "Description cannot exceed 1000 characters");



/* =====================================================
 STORED PROCEDURE EQUIVALENT
===================================================== */

// Get all pending reports
userReportsSchema.statics.getPendingReports = async function(){
return this.find({ status: "pending" });
};


// Get reports by user
userReportsSchema.statics.getReportsByUser = async function(userId){
return this.find({ user_id: userId });
};


// Resolve report
userReportsSchema.statics.resolveReport = async function(reportId, adminId){

return this.findOneAndUpdate(
{ report_id: reportId },
{
status: "resolved",
reviewed_by: adminId,
reviewed_at: new Date()
},
{ new: true }

);

};



/* =====================================================
TASK 4: DATABASE VIEW EQUIVALENT
Aggregation pipeline acting as view
===================================================== */

// Report summary view
userReportsSchema.statics.reportSummaryView = async function(){

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



module.exports = mongoose.model("UserReports", userReportsSchema);