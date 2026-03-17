const mongoose = require("mongoose");

const disputesSchema = new mongoose.Schema({

dispute_id:{
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

payment_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Payment"
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
enum:["pending","under_review","resolved","rejected"],
default:"pending"
},

created_at:{
type:Date,
default:Date.now
},

resolved_by:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

resolved_at:{
type:Date
}

});


/* =====================================================
Index Optimization
===================================================== */

// Search disputes by user
disputesSchema.index({ user_id: 1 });

// Lookup disputes by course
disputesSchema.index({ course_id: 1 });

// Lookup disputes by payment
disputesSchema.index({ payment_id: 1 });

// Filter by dispute status
disputesSchema.index({ status: 1 });

// Sorting disputes by creation date
disputesSchema.index({ created_at: -1 });

// Compound index for admin dashboard
disputesSchema.index({ status: 1, created_at: -1 });

// Text search for dispute investigation
disputesSchema.index({ reason: "text", description: "text" });



/* =====================================================
Partial Indexing
===================================================== */

// Index only active disputes for faster moderation
disputesSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: { $in:["pending","under_review"] } } }
);


// Index recent disputes only
disputesSchema.index(
{ created_at: -1 },
{ partialFilterExpression: { status: "pending" } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get all pending disputes
disputesSchema.statics.getPendingDisputes = async function(){
return this.find({ status:"pending" });
};


// Get disputes by user
disputesSchema.statics.getDisputesByUser = async function(userId){
return this.find({ user_id:userId });
};


// Resolve dispute
disputesSchema.statics.resolveDispute = async function(disputeId, adminId){

return this.findOneAndUpdate(
{ dispute_id:disputeId },
{
status:"resolved",
resolved_by:adminId,
resolved_at:new Date()
},
{ new:true }

);

};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Dispute summary view
disputesSchema.statics.disputeSummaryView = async function(){

return this.aggregate([

{
$group:{
_id:"$status",
total_disputes:{ $sum:1 }
}
},

{
$project:{
status:"$_id",
total_disputes:1,
_id:0
}
}

]);

};


// Disputes per course view
disputesSchema.statics.disputesPerCourseView = async function(){

return this.aggregate([

{
$group:{
_id:"$course_id",
total_disputes:{ $sum:1 }
}
},

{
$sort:{ total_disputes:-1 }
}

]);

};


module.exports = mongoose.model("Disputes", disputesSchema);