const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({

module_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Module",
required:true
},

title:{
type:String,
required:true
},

content_url:{
type:String,
required:true
},

order:{
type:Number,
required:true
}

});

/* INDEX OPTIMIZATION */

lessonSchema.index({ module_id:1 });
lessonSchema.index({ order:1 });

module.exports = mongoose.model("Lesson", lessonSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for module lesson ordering
lessonSchema.index({ module_id:1, order:1 });

// Text search index for lesson titles
lessonSchema.index({ title:"text" });



/* =====================================================
Partial Indexing
===================================================== */

// Index lessons that contain a valid content URL
lessonSchema.index(
{ content_url:1 },
{ partialFilterExpression:{ content_url:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get lessons by module
lessonSchema.statics.getLessonsByModule = function(moduleId){
return this.find({ module_id: moduleId }).sort({ order:1 });
};

// Get a lesson by title
lessonSchema.statics.getLessonByTitle = function(title){
return this.findOne({ title:title });
};

// Update lesson order
lessonSchema.statics.updateLessonOrder = function(lessonId,newOrder){
return this.findByIdAndUpdate(
lessonId,
{ order:newOrder },
{ new:true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: number of lessons per module
lessonSchema.statics.lessonsPerModuleView = function(){
return this.aggregate([
{
$group:{
_id:"$module_id",
total_lessons:{ $sum:1 }
}
},
{
$sort:{ total_lessons:-1 }
}
]);
};

// View: ordered lesson list
lessonSchema.statics.lessonOrderView = function(){
return this.aggregate([
{
$sort:{ order:1 }
},
{
$project:{
title:1,
module_id:1,
order:1
}
}
]);
};