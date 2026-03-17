const mongoose = require("mongoose");

const adminNotificationsSchema = new mongoose.Schema({

    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

    message: {
        type: String,
        required: true,
        maxlength: 500
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },

    read_status: {
        type: Boolean,
        default: false
    },

    read_at: Date,

    created_at: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

/* INDEX OPTIMIZATION */

userSchema.index({ email:1 });
userSchema.index({ role:1 });
userSchema.index({ status:1 });
userSchema.index({ created_at:-1 });

/* INDEX */

adminNotificationsSchema.index({ admin_id: 1 });
adminNotificationsSchema.index({ read_status: 1 });
adminNotificationsSchema.index({ created_at: -1 });

module.exports = mongoose.model("AdminNotification", adminNotificationsSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for admin + read status
adminNotificationsSchema.index({ admin_id: 1, read_status: 1 });

// Index for priority based queries
adminNotificationsSchema.index({ priority: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only unread notifications
adminNotificationsSchema.index(
{ read_status: 1 },
{ partialFilterExpression: { read_status: false } }
);

// Index notifications with high priority
adminNotificationsSchema.index(
{ priority: 1 },
{ partialFilterExpression: { priority: "high" } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get notifications by admin
adminNotificationsSchema.statics.getNotificationsByAdmin = function(adminId){
return this.find({ admin_id: adminId }).sort({ created_at: -1 });
};

// Get unread notifications
adminNotificationsSchema.statics.getUnreadNotifications = function(adminId){
return this.find({ admin_id: adminId, read_status: false });
};

// Mark notification as read
adminNotificationsSchema.statics.markAsRead = function(notificationId){
return this.findByIdAndUpdate(
notificationId,
{ read_status: true, read_at: new Date() },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: notification count by priority
adminNotificationsSchema.statics.notificationsByPriorityView = function(){
return this.aggregate([
{
$group:{
_id: "$priority",
total: { $sum: 1 }
}
},
{
$sort:{ total: -1 }
}
]);
};

// View: unread notifications per admin
adminNotificationsSchema.statics.unreadNotificationsPerAdminView = function(){
return this.aggregate([
{
$match:{ read_status: false }
},
{
$group:{
_id: "$admin_id",
unread_notifications: { $sum: 1 }
}
}
]);
};