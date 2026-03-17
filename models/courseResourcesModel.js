const mongoose = require("mongoose");

const courseResourcesSchema = new mongoose.Schema({

resource_id:{
type:String,
required:true,
unique:true
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

title:{
type:String,
required:true
},

resource_type:{
type:String,
enum:["video","pdf","link","document"],
required:true
},

resource_url:{
type:String,
required:true
},

uploaded_by:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

uploaded_at:{
type:Date,
default:Date.now
},

status:{
type:String,
enum:["active","inactive"],
default:"active"
}

});


/* =====================================================
Index Optimization
===================================================== */

// Course resource lookup
courseResourcesSchema.index({ course_id: 1 });

// Resource type filtering
courseResourcesSchema.index({ resource_type: 1 });

// Instructor uploads lookup
courseResourcesSchema.index({ uploaded_by: 1 });

// Sorting resources by upload time
courseResourcesSchema.index({ uploaded_at: -1 });

// Compound index for course + resource type
courseResourcesSchema.index({ course_id: 1, resource_type: 1 });

// Text search index
courseResourcesSchema.index({ title: "text" });



/* =====================================================
Partial Indexing
===================================================== */

// Only index active resources
courseResourcesSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "active" } }
);


// Partial index for video resources
courseResourcesSchema.index(
{ resource_type: 1 },
{ partialFilterExpression: { resource_type: "video" } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get all active resources
courseResourcesSchema.statics.getActiveResources = async function(){
return this.find({ status: "active" });
};


// Get resources by course
courseResourcesSchema.statics.getResourcesByCourse = async function(courseId){
return this.find({ course_id: courseId });
};


// Get resources uploaded by instructor
courseResourcesSchema.statics.getResourcesByInstructor = async function(instructorId){
return this.find({ uploaded_by: instructorId });
};




/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// Resource summary view
courseResourcesSchema.statics.resourceSummaryView = async function(){

return this.aggregate([

{
$group:{
_id:"$resource_type",
total_resources:{ $sum:1 }
}
},

{
$project:{
resource_type:"$_id",
total_resources:1,
_id:0
}
}

]);

};


// Resources per course view
courseResourcesSchema.statics.resourcesPerCourseView = async function(){

return this.aggregate([

{
$group:{
_id:"$course_id",
total_resources:{ $sum:1 }
}
},

{
$sort:{ total_resources:-1 }
}

]);

};


module.exports = mongoose.model("CourseResources", courseResourcesSchema);