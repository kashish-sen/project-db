const mongoose = require("mongoose");

const platformRevenueSchema = new mongoose.Schema({

revenue_id:String,

payment_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Payment"
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

total_amount:Number,

platform_commission:Number,

instructor_payout:Number,

currency:String,

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("PlatformRevenue",platformRevenueSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for payment lookup
platformRevenueSchema.index({ payment_id:1 });

// Index for user revenue tracking
platformRevenueSchema.index({ user_id:1 });

// Index for course revenue analytics
platformRevenueSchema.index({ course_id:1 });

// Index for instructor revenue analytics
platformRevenueSchema.index({ instructor_id:1 });

// Index for sorting by revenue creation date
platformRevenueSchema.index({ created_at:-1 });

// Compound index for instructor and course queries
platformRevenueSchema.index({ instructor_id:1, course_id:1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only documents where platform commission exists
platformRevenueSchema.index(
{ platform_commission:1 },
{ partialFilterExpression:{ platform_commission:{ $exists:true } } }
);

// Index documents where instructor payout exists
platformRevenueSchema.index(
{ instructor_payout:1 },
{ partialFilterExpression:{ instructor_payout:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get revenue by instructor
platformRevenueSchema.statics.getRevenueByInstructor = function(instructorId){
return this.find({ instructor_id: instructorId });
};

// Get revenue by course
platformRevenueSchema.statics.getRevenueByCourse = function(courseId){
return this.find({ course_id: courseId });
};

// Calculate total platform commission
platformRevenueSchema.statics.calculatePlatformCommission = function(){
return this.aggregate([
{
$group:{
_id:null,
total_commission:{ $sum:"$platform_commission" }
}
}
]);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: revenue per instructor
platformRevenueSchema.statics.revenuePerInstructorView = function(){
return this.aggregate([
{
$group:{
_id:"$instructor_id",
total_revenue:{ $sum:"$total_amount" },
total_payout:{ $sum:"$instructor_payout" }
}
},
{
$sort:{ total_revenue:-1 }
}
]);
};

// View: revenue per course
platformRevenueSchema.statics.revenuePerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
total_revenue:{ $sum:"$total_amount" },
platform_commission:{ $sum:"$platform_commission" },
instructor_payout:{ $sum:"$instructor_payout" }
}
},
{
$sort:{ total_revenue:-1 }
}
]);
};