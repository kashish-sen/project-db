const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({

    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    module_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    },

    title: {
        type: String,
        required: true
    },

    description: String,

    due_date: Date,

    max_score: {
        type: Number,
        min: 0,
        max: 100
    }

}, { timestamps: true });

/* INDEX */

assignmentSchema.index({ course_id: 1 });
assignmentSchema.index({ module_id: 1 });
assignmentSchema.index({ due_date: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for course + module queries
assignmentSchema.index({ course_id: 1, module_id: 1 });

// Index for sorting assignments by due date
assignmentSchema.index({ due_date: -1 });

// Text index for assignment search
assignmentSchema.index({ title: "text", description: "text" });



/* =====================================================
Partial Indexing
===================================================== */

// Index assignments that have due dates
assignmentSchema.index(
{ due_date: 1 },
{ partialFilterExpression: { due_date: { $exists: true } } }
);

// Index assignments that have max_score defined
assignmentSchema.index(
{ max_score: 1 },
{ partialFilterExpression: { max_score: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get assignments by course
assignmentSchema.statics.getAssignmentsByCourse = function(courseId){
return this.find({ course_id: courseId }).sort({ due_date: 1 });
};

// Get assignments by module
assignmentSchema.statics.getAssignmentsByModule = function(moduleId){
return this.find({ module_id: moduleId });
};

// Update assignment score limit
assignmentSchema.statics.updateMaxScore = function(assignmentId, score){
return this.findByIdAndUpdate(
assignmentId,
{ max_score: score },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: assignments per course
assignmentSchema.statics.assignmentsPerCourseView = function(){
return this.aggregate([
{
$group:{
_id: "$course_id",
total_assignments: { $sum: 1 }
}
},
{
$sort:{ total_assignments: -1 }
}
]);
};

// View: assignments due timeline
assignmentSchema.statics.assignmentDueTimelineView = function(){
return this.aggregate([
{
$match:{ due_date: { $exists: true } }
},
{
$sort:{ due_date: 1 }
},
{
$project:{
course_id:1,
module_id:1,
title:1,
due_date:1
}
}
]);
};