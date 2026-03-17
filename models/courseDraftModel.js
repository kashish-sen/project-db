const mongoose = require("mongoose");

const courseDraftSchema = new mongoose.Schema({

draft_id:{
type:String,
required:true,
unique:true
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor",
required:true
},

course_title:{
type:String,
required:true
},

description:String,

status:{
type:String,
enum:["draft","submitted","published"],
default:"draft"
},

created_at:{
type:Date,
default:Date.now
}

});

/* INDEX OPTIMIZATION */

courseDraftSchema.index({ instructor_id:1 });
courseDraftSchema.index({ status:1 });

module.exports = mongoose.model("CourseDraft", courseDraftSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for instructor + status queries
courseDraftSchema.index({ instructor_id:1, status:1 });

// Index for sorting drafts by creation date
courseDraftSchema.index({ created_at:-1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only submitted drafts
courseDraftSchema.index(
{ status:1 },
{ partialFilterExpression:{ status:"submitted" } }
);

// Index drafts where description exists
courseDraftSchema.index(
{ description:1 },
{ partialFilterExpression:{ description:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get drafts by instructor
courseDraftSchema.statics.getDraftsByInstructor = function(instructorId){
return this.find({ instructor_id:instructorId });
};

// Get submitted drafts
courseDraftSchema.statics.getSubmittedDrafts = function(){
return this.find({ status:"submitted" });
};

// Publish a draft
courseDraftSchema.statics.publishDraft = function(draftId){
return this.findOneAndUpdate(
{ draft_id:draftId },
{ status:"published" },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: drafts per instructor
courseDraftSchema.statics.draftsPerInstructorView = function(){
return this.aggregate([
{
$group:{
_id:"$instructor_id",
total_drafts:{ $sum:1 }
}
},
{
$sort:{ total_drafts:-1 }
}
]);
};

// View: draft status summary
courseDraftSchema.statics.draftStatusSummaryView = function(){
return this.aggregate([
{
$group:{
_id:"$status",
total:{ $sum:1 }
}
}
]);
};