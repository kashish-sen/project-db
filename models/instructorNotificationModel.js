const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({

instructor_id:{
type:String,
required:true,
unique:true
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

instructor_name:{
type:String,
required:true
},

email:{
type:String,
required:true
},

phone_number:{
type:String
},

bio:{
type:String,
required:true
},

expertise:{
type:[String],
required:true
},

experience_years:{
type:Number
},

education:{
type:String
},

profile_picture:{
type:String
},

rating:{
type:Number,
default:0
},

total_students:{
type:Number,
default:0
},

total_courses:{
type:Number,
default:0
},

verified:{
type:Boolean,
default:false
},

status:{
type:String,
enum:["pending","approved","rejected"],
default:"pending"
},

approved_by_admin:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Instructor", instructorSchema);


/* =====================================================
Index Optimization
===================================================== */

// Instructor search by user
instructorSchema.index({ user_id: 1 });

// Email lookup
instructorSchema.index({ email: 1 });

// Status filtering for admin approvals
instructorSchema.index({ status: 1 });

// Sorting instructors by rating
instructorSchema.index({ rating: -1 });

// Sorting by number of students
instructorSchema.index({ total_students: -1 });

// Compound index for status + verification
instructorSchema.index({ status: 1, verified: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only approved instructors
instructorSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "approved" } }
);

// Index only verified instructors
instructorSchema.index(
{ verified: 1 },
{ partialFilterExpression: { verified: true } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get approved instructors
instructorSchema.statics.getApprovedInstructors = function() {
return this.find({ status: "approved" });
};

// Get instructor by user id
instructorSchema.statics.getInstructorByUser = function(userId) {
return this.findOne({ user_id: userId });
};

// Verify instructor
instructorSchema.statics.verifyInstructor = function(instructorId, adminId) {
return this.findOneAndUpdate(
{ instructor_id: instructorId },
{ verified: true, approved_by_admin: adminId, status: "approved" },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Top instructors by students
instructorSchema.statics.topInstructorsByStudentsView = function() {
return this.aggregate([
{
$match: { status: "approved" }
},
{
$sort: { total_students: -1 }
},
{
$project: {
instructor_name: 1,
total_students: 1,
rating: 1,
total_courses: 1
}
}
]);
};

// Instructor expertise distribution
instructorSchema.statics.instructorExpertiseView = function() {
return this.aggregate([
{
$unwind: "$expertise"
},
{
$group: {
_id: "$expertise",
total_instructors: { $sum: 1 }
}
},
{
$sort: { total_instructors: -1 }
}
]);
};const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({

instructor_id:{
type:String,
required:true,
unique:true
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

instructor_name:{
type:String,
required:true
},

email:{
type:String,
required:true
},

phone_number:{
type:String
},

bio:{
type:String,
required:true
},

expertise:{
type:[String],
required:true
},

experience_years:{
type:Number
},

education:{
type:String
},

profile_picture:{
type:String
},

rating:{
type:Number,
default:0
},

total_students:{
type:Number,
default:0
},

total_courses:{
type:Number,
default:0
},

verified:{
type:Boolean,
default:false
},

status:{
type:String,
enum:["pending","approved","rejected"],
default:"pending"
},

approved_by_admin:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Instructor", instructorSchema);


/* =====================================================
Index Optimization
===================================================== */

// Instructor search by user
instructorSchema.index({ user_id: 1 });

// Email lookup
instructorSchema.index({ email: 1 });

// Status filtering for admin approvals
instructorSchema.index({ status: 1 });

// Sorting instructors by rating
instructorSchema.index({ rating: -1 });

// Sorting by number of students
instructorSchema.index({ total_students: -1 });

// Compound index for status + verification
instructorSchema.index({ status: 1, verified: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only approved instructors
instructorSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "approved" } }
);

// Index only verified instructors
instructorSchema.index(
{ verified: 1 },
{ partialFilterExpression: { verified: true } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get approved instructors
instructorSchema.statics.getApprovedInstructors = function() {
return this.find({ status: "approved" });
};

// Get instructor by user id
instructorSchema.statics.getInstructorByUser = function(userId) {
return this.findOne({ user_id: userId });
};

// Verify instructor
instructorSchema.statics.verifyInstructor = function(instructorId, adminId) {
return this.findOneAndUpdate(
{ instructor_id: instructorId },
{ verified: true, approved_by_admin: adminId, status: "approved" },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Top instructors by students
instructorSchema.statics.topInstructorsByStudentsView = function() {
return this.aggregate([
{
$match: { status: "approved" }
},
{
$sort: { total_students: -1 }
},
{
$project: {
instructor_name: 1,
total_students: 1,
rating: 1,
total_courses: 1
}
}
]);
};

// Instructor expertise distribution
instructorSchema.statics.instructorExpertiseView = function() {
return this.aggregate([
{
$unwind: "$expertise"
},
{
$group: {
_id: "$expertise",
total_instructors: { $sum: 1 }
}
},
{
$sort: { total_instructors: -1 }
}
]);
};