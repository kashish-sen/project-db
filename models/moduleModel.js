const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

title:{
type:String,
required:true
},

order:{
type:Number,
required:true
}

});

/* INDEX OPTIMIZATION */

moduleSchema.index({ course_id:1 });
moduleSchema.index({ order:1 });

module.exports = mongoose.model("Module", moduleSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for course modules ordering
moduleSchema.index({ course_id:1, order:1 });

// Text index for module title search
moduleSchema.index({ title:"text" });



/* =====================================================
Partial Indexing
===================================================== */

// Index modules that contain a title
moduleSchema.index(
{ title:1 },
{ partialFilterExpression:{ title:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get modules by course
moduleSchema.statics.getModulesByCourse = function(courseId){
return this.find({ course_id: courseId }).sort({ order:1 });
};

// Get module by title
moduleSchema.statics.getModuleByTitle = function(title){
return this.findOne({ title:title });
};

// Update module order
moduleSchema.statics.updateModuleOrder = function(moduleId,newOrder){
return this.findByIdAndUpdate(
moduleId,
{ order:newOrder },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: number of modules per course
moduleSchema.statics.modulesPerCourseView = function(){
return this.aggregate([
{
$group:{
_id:"$course_id",
total_modules:{ $sum:1 }
}
},
{
$sort:{ total_modules:-1 }
}
]);
};

// View: ordered module list
moduleSchema.statics.moduleOrderView = function(){
return this.aggregate([
{
$sort:{ order:1 }
},
{
$project:{
title:1,
course_id:1,
order:1
}
}
]);
};