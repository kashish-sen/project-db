const mongoose = require("mongoose");

const courseAnnouncementSchema = new mongoose.Schema({

announcement_id:{
type:String,
required:true
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
},

title:{
type:String,
required:true
},

message:{
type:String,
required:true
},

created_at:{
type:Date,
default:Date.now
}

});

/* INDEX OPTIMIZATION */

courseAnnouncementSchema.index({ course_id:1 });
courseAnnouncementSchema.index({ instructor_id:1 });
courseAnnouncementSchema.index({ created_at:-1 });

module.exports = mongoose.model("CourseAnnouncement", courseAnnouncementSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for course + instructor queries
courseAnnouncementSchema.index({ course_id:1, instructor_id:1 });

// Text index for searching announcements
courseAnnouncementSchema.index({ title:"text", message:"text" });



/* =====================================================
Partial Indexing
===================================================== */

// Index announcements where message exists
courseAnnouncementSchema.index(
{ message:1 },
{ partialFilterExpression:{ message:{ $exists:true } } }
);

// Index announcements where title exists
courseAnnouncementSchema.index(
{ title:1 },
{ partialFilterExpression:{ title:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get announcements by course
courseAnnouncementSchema.statics.getAnnouncementsByCourse = function(courseId){
return this.find({ course_id:courseId }).sort({ created_at:-1 });
};

// Get announcements by instructor
courseAnnouncementSchema.statics.getAnnouncementsByInstructor = function(instructorId){
return this.find({ instructor_id:instructorId });
};

// Get latest announcements
courseAnnouncementSchema.statics.getLatestAnnouncements = function(){
return this.find().sort({ created_at:-1 }).limit(10);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: announcements per course
courseAnnouncementSchema.statics.announcementsPerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
total_announcements:{ $sum:1 }
}
},
{
$sort:{ total_announcements:-1 }
}
]);
};

// View: announcements per instructor
courseAnnouncementSchema.statics.announcementsPerInstructorView = function(){
return this.aggregate([
{
$group:{
_id:"$instructor_id",
total_announcements:{ $sum:1 }
}
},
{
$sort:{ total_announcements:-1 }
}
]);
};