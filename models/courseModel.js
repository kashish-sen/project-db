const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

course_id:{
type:String,
required:true,
unique:true
},

title:{
type:String,
required:true
},

description:{
type:String
},

category:{
type:String,
required:true
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor",
required:true
},

price:{
type:Number,
required:true
},

level:{
type:String,
enum:["beginner","intermediate","advanced"],
required:true
},

rating:{
type:Number,
default:0
},

total_students:{
type:Number,
default:0
},

status:{
type:String,
enum:["active","inactive"],
default:"active"
},

created_at:{
type:Date,
default:Date.now
}

});


/* =====================================================
Index Optimization
===================================================== */

// Search by course title
courseSchema.index({ title: 1 });

// Category filtering
courseSchema.index({ category: 1 });

// Instructor courses lookup
courseSchema.index({ instructor_id: 1 });

// Rating sorting
courseSchema.index({ rating: -1 });

// Compound index for course discovery
courseSchema.index({ category: 1, level: 1 });

// Students analytics
courseSchema.index({ total_students: -1 });




/* =====================================================
Partial Indexing
===================================================== */

// Only index active courses for faster queries
courseSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "active" } }
);


// Partial index for popular courses
courseSchema.index(
{ total_students: -1 },
{ partialFilterExpression: { total_students: { $gt: 100 } } }
);




/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get all active courses
courseSchema.statics.getActiveCourses = async function(){
return this.find({ status: "active" });
};


// Get courses by instructor
courseSchema.statics.getCoursesByInstructor = async function(instructorId){
return this.find({ instructor_id: instructorId });
};


// Update student count
courseSchema.statics.incrementStudentCount = async function(courseId){

return this.findOneAndUpdate(
{ course_id: courseId },
{ $inc: { total_students: 1 } },
{ new: true }

);

};




/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Course analytics view
courseSchema.statics.courseAnalyticsView = async function(){

return this.aggregate([

{
$project:{
title:1,
category:1,
level:1,
rating:1,
total_students:1,
status:1
}
}

]);

};


// Popular courses view
courseSchema.statics.popularCoursesView = async function(){

return this.aggregate([

{
$match:{
total_students:{ $gt:100 }
}
},

{
$sort:{ total_students:-1 }
},

{
$project:{
title:1,
rating:1,
total_students:1
}
}

]);

};


module.exports = mongoose.model("Course", courseSchema);