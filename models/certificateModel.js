const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

certificate_id:{
type:String,
required:true,
unique:true
},

user_id:{
type:String,
required:true
},

course_id:{
type:String,
required:true
},

certificate_url:{
type:String,
required:true
},

issued_at:{
type:Date,
default:Date.now
}

});

/* INDEX OPTIMIZATION */

certificateSchema.index({ user_id:1 });
certificateSchema.index({ course_id:1 });

module.exports = mongoose.model("Certificate", certificateSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for user + course certificate lookup
certificateSchema.index({ user_id:1, course_id:1 });

// Index for sorting certificates by issue date
certificateSchema.index({ issued_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index records where certificate URL exists
certificateSchema.index(
{ certificate_url:1 },
{ partialFilterExpression:{ certificate_url:{ $exists:true } } }
);

// Index certificates issued after a date
certificateSchema.index(
{ issued_at:1 },
{ partialFilterExpression:{ issued_at:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get certificates by user
certificateSchema.statics.getCertificatesByUser = function(userId){
return this.find({ user_id:userId });
};

// Get certificates by course
certificateSchema.statics.getCertificatesByCourse = function(courseId){
return this.find({ course_id:courseId });
};

// Issue new certificate
certificateSchema.statics.issueCertificate = function(data){
return this.create(data);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: certificates per course
certificateSchema.statics.certificatesPerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
total_certificates:{ $sum:1 }
}
},
{
$sort:{ total_certificates:-1 }
}
]);
};

// View: certificates per user
certificateSchema.statics.certificatesPerUserView = function(){
return this.aggregate([
{
$group:{
_id:"$user_id",
total_certificates:{ $sum:1 }
}
},
{
$sort:{ total_certificates:-1 }
}
]);
};