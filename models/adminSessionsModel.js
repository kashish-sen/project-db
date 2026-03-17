const mongoose = require("mongoose");

const adminSessionSchema = new mongoose.Schema({

    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },

    session_id: {
        type: String,
        required: true
    },

    login_time: {
        type: Date,
        default: Date.now
    },

    logout_time: Date,

    session_status: {
        type: String,
        enum: ["active", "expired"],
        default: "active"
    }

}, { timestamps: true });

/* INDEXES */

adminSessionSchema.index({ admin_id: 1 });
adminSessionSchema.index({ session_status: 1 });
adminSessionSchema.index({ login_time: -1 });
adminSessionSchema.index({ session_id: 1 });

module.exports = mongoose.model("AdminSession", adminSessionSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for admin + session status queries
adminSessionSchema.index({ admin_id: 1, session_status: 1 });

// Compound index for admin + login time
adminSessionSchema.index({ admin_id: 1, login_time: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only active sessions
adminSessionSchema.index(
{ session_status: 1 },
{ partialFilterExpression: { session_status: "active" } }
);

// Index sessions where logout time exists
adminSessionSchema.index(
{ logout_time: 1 },
{ partialFilterExpression: { logout_time: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get sessions by admin
adminSessionSchema.statics.getSessionsByAdmin = function(adminId){
return this.find({ admin_id: adminId }).sort({ login_time: -1 });
};

// Get active sessions
adminSessionSchema.statics.getActiveSessions = function(){
return this.find({ session_status: "active" });
};

// Expire a session
adminSessionSchema.statics.expireSession = function(sessionId){
return this.findOneAndUpdate(
{ session_id: sessionId },
{ session_status: "expired", logout_time: new Date() },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: sessions per admin
adminSessionSchema.statics.sessionsPerAdminView = function(){
return this.aggregate([
{
$group:{
_id: "$admin_id",
total_sessions: { $sum: 1 }
}
},
{
$sort:{ total_sessions: -1 }
}
]);
};

// View: active session summary
adminSessionSchema.statics.activeSessionSummaryView = function(){
return this.aggregate([
{
$match:{ session_status: "active" }
},
{
$group:{
_id: "$admin_id",
active_sessions: { $sum: 1 }
}
}
]);
};