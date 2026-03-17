const mongoose = require("mongoose");

const adminUserActionsSchema = new mongoose.Schema({

    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    action: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    created_at: {
        type: Date,
        default: Date.now
    }

});

/* INDEX */

adminUserActionsSchema.index({ admin_id: 1 });
adminUserActionsSchema.index({ user_id: 1 });
adminUserActionsSchema.index({ created_at: -1 });

module.exports = mongoose.model("AdminUserActions", adminUserActionsSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for admin + action queries
adminUserActionsSchema.index({ admin_id: 1, action: 1 });

// Compound index for user + action queries
adminUserActionsSchema.index({ user_id: 1, action: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index records where action exists
adminUserActionsSchema.index(
{ action: 1 },
{ partialFilterExpression: { action: { $exists: true } } }
);

// Index records where description exists
adminUserActionsSchema.index(
{ description: 1 },
{ partialFilterExpression: { description: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get actions performed by admin
adminUserActionsSchema.statics.getActionsByAdmin = function(adminId){
return this.find({ admin_id: adminId }).sort({ created_at: -1 });
};

// Get actions related to a user
adminUserActionsSchema.statics.getActionsByUser = function(userId){
return this.find({ user_id: userId }).sort({ created_at: -1 });
};

// Log new admin action
adminUserActionsSchema.statics.logAdminAction = function(data){
return this.create(data);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: actions count per admin
adminUserActionsSchema.statics.actionsPerAdminView = function(){
return this.aggregate([
{
$group:{
_id: "$admin_id",
total_actions: { $sum: 1 }
}
},
{
$sort:{ total_actions: -1 }
}
]);
};

// View: actions by type
adminUserActionsSchema.statics.actionsByTypeView = function(){
return this.aggregate([
{
$group:{
_id: "$action",
total: { $sum: 1 }
}
},
{
$sort:{ total: -1 }
}
]);
};