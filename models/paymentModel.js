const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

amount:{
type:Number,
required:true
},

payment_status:{
type:String,
enum:["pending","success","failed"],
required:true
},

payment_date:{
type:Date,
default:Date.now
}

});

/* INDEX OPTIMIZATION */

paymentSchema.index({ user_id:1 });
paymentSchema.index({ course_id:1 });
paymentSchema.index({ payment_status:1 });
paymentSchema.index({ payment_date:-1 });

module.exports = mongoose.model("Payment", paymentSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for user course payments
paymentSchema.index({ user_id:1, course_id:1 });

// Compound index for payment status and date
paymentSchema.index({ payment_status:1, payment_date:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only successful payments
paymentSchema.index(
{ payment_status:1 },
{ partialFilterExpression:{ payment_status:"success" } }
);

// Index payments where amount exists
paymentSchema.index(
{ amount:1 },
{ partialFilterExpression:{ amount:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get payments by user
paymentSchema.statics.getPaymentsByUser = function(userId){
return this.find({ user_id:userId });
};

// Get successful payments for a course
paymentSchema.statics.getSuccessfulPaymentsByCourse = function(courseId){
return this.find({ course_id:courseId, payment_status:"success" });
};

// Update payment status
paymentSchema.statics.updatePaymentStatus = function(paymentId,status){
return this.findByIdAndUpdate(
paymentId,
{ payment_status:status },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: total revenue per course
paymentSchema.statics.revenuePerCourseView = function(){
return this.aggregate([
{
$match:{ payment_status:"success" }
},
{
$group:{
_id:"$course_id",
total_revenue:{ $sum:"$amount" },
total_payments:{ $sum:1 }
}
},
{
$sort:{ total_revenue:-1 }
}
]);
};

// View: payments per user
paymentSchema.statics.paymentsPerUserView = function(){
return this.aggregate([
{
$group:{
_id:"$user_id",
total_spent:{ $sum:"$amount" },
total_transactions:{ $sum:1 }
}
},
{
$sort:{ total_spent:-1 }
}
]);
};