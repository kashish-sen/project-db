const mongoose = require("mongoose");

const systemLogsSchema = new mongoose.Schema({

log_id:String,

admin_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

action:String,

entity_type:String,

entity_id:String,

description:String,

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("SystemLog",systemLogsSchema);


/* =====================================================
Index Optimization
===================================================== */

// Index for admin log lookup
systemLogsSchema.index({ admin_id:1 });

// Index for action based queries
systemLogsSchema.index({ action:1 });

// Index for entity tracking
systemLogsSchema.index({ entity_type:1 });

// Index for entity id lookup
systemLogsSchema.index({ entity_id:1 });

// Index for sorting logs by time
systemLogsSchema.index({ created_at:-1 });

// Compound index for entity tracking
systemLogsSchema.index({ entity_type:1, entity_id:1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index logs where action exists
systemLogsSchema.index(
{ action:1 },
{ partialFilterExpression:{ action:{ $exists:true } } }
);

// Index logs where description exists
systemLogsSchema.index(
{ description:1 },
{ partialFilterExpression:{ description:{ $exists:true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get logs by admin
systemLogsSchema.statics.getLogsByAdmin = function(adminId){
return this.find({ admin_id:adminId });
};

// Get logs by entity
systemLogsSchema.statics.getLogsByEntity = function(entityType,entityId){
return this.find({ entity_type:entityType, entity_id:entityId });
};

// Get recent logs
systemLogsSchema.statics.getRecentLogs = function(){
return this.find().sort({ created_at:-1 }).limit(50);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: actions summary
systemLogsSchema.statics.actionSummaryView = function(){
return this.aggregate([
{
$group:{
_id:"$action",
total_actions:{ $sum:1 }
}
},
{
$sort:{ total_actions:-1 }
}
]);
};

// View: activity per admin
systemLogsSchema.statics.adminActivityView = function(){
return this.aggregate([
{
$group:{
_id:"$admin_id",
total_actions:{ $sum:1 }
}
},
{
$sort:{ total_actions:-1 }
}
]);
};