const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

enrollment_id:{
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
ref:"Course",
required:true
},

enrolled_at:{
type:Date,
default:Date.now
},

progress:{
type:Number,
default:0
},

status:{
type:String,
enum:["active","completed","dropped"],
default:"active"
},

completed_at:{
type:Date
}

});


/* =====================================================
Index Optimization
===================================================== */

// Find enrollments by user
enrollmentSchema.index({ user_id: 1 });

// Find enrollments by course
enrollmentSchema.index({ course_id: 1 });

// Filter by enrollment status
enrollmentSchema.index({ status: 1 });

// Sorting by enrollment date
enrollmentSchema.index({ enrolled_at: -1 });

// Compound index for user-course relationship
enrollmentSchema.index({ user_id: 1, course_id: 1 });

// Progress tracking queries
enrollmentSchema.index({ progress: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only active enrollments
enrollmentSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "active" } }
);


// Index only completed courses
enrollmentSchema.index(
{ completed_at: -1 },
{ partialFilterExpression: { status: "completed" } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get all enrollments of a user
enrollmentSchema.statics.getEnrollmentsByUser = async function(userId){
return this.find({ user_id: userId });
};


// Get enrollments for a course
enrollmentSchema.statics.getEnrollmentsByCourse = async function(courseId){
return this.find({ course_id: courseId });
};


// Update course progress
enrollmentSchema.statics.updateProgress = async function(enrollmentId, progressValue){

return this.findOneAndUpdate(
{ enrollment_id: enrollmentId },
{ progress: progressValue },
{ new: true }
);

};


// Mark course as completed
enrollmentSchema.statics.completeCourse = async function(enrollmentId){

return this.findOneAndUpdate(
{ enrollment_id: enrollmentId },
{
status:"completed",
completed_at:new Date(),
progress:100
},
{ new:true }

);

};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Enrollment summary view
enrollmentSchema.statics.enrollmentSummaryView = async function(){

return this.aggregate([

{
$group:{
_id:"$status",
total_enrollments:{ $sum:1 }
}
},

{
$project:{
status:"$_id",
total_enrollments:1,
_id:0
}
}

]);

};


// Enrollments per course view
enrollmentSchema.statics.enrollmentsPerCourseView = async function(){

return this.aggregate([

{
$group:{
_id:"$course_id",
total_enrollments:{ $sum:1 }
}
},

{
$sort:{ total_enrollments:-1 }
}

]);

};


module.exports = mongoose.model("Enrollment", enrollmentSchema);