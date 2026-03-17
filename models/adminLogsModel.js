const mongoose = require("mongoose");

const adminLogsSchema = new mongoose.Schema({

    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

    action: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["success", "failed"]
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"]
    },

    created_at: {
        type: Date,
        default: Date.now
    }

});

/* INDEXES */

adminLogsSchema.index({ admin_id: 1 });
adminLogsSchema.index({ created_at: -1 });
adminLogsSchema.index({ status: 1 });
adminLogsSchema.index({ severity: 1 });

module.exports = mongoose.model("AdminLogs", adminLogsSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for admin + status queries
adminLogsSchema.index({ admin_id: 1, status: 1 });

// Compound index for severity + created time
adminLogsSchema.index({ severity: 1, created_at: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only failed logs
adminLogsSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "failed" } }
);

// Index only high severity logs
adminLogsSchema.index(
{ severity: 1 },
{ partialFilterExpression: { severity: "high" } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get logs by admin
adminLogsSchema.statics.getLogsByAdmin = function(adminId){
return this.find({ admin_id: adminId }).sort({ created_at: -1 });
};

// Get failed logs
adminLogsSchema.statics.getFailedLogs = function(){
return this.find({ status: "failed" }).sort({ created_at: -1 });
};

// Create new log
adminLogsSchema.statics.createLog = function(data){
return this.create(data);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: logs grouped by status
adminLogsSchema.statics.logsByStatusView = function(){
return this.aggregate([
{
$group:{
_id: "$status",
total_logs: { $sum: 1 }
}
}
]);
};

// View: logs grouped by severity
adminLogsSchema.statics.logsBySeverityView = function(){
return this.aggregate([
{
$group:{
_id: "$severity",
total_logs: { $sum: 1 }
}
},
{
$sort:{ total_logs: -1 }
}
]);
};