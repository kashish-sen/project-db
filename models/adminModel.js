const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password_hash: {
        type: String,
        required: true,
        minlength: 60
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdminRole",
        required: true
    },

    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    },

    last_login: {
        type: Date
    }

}, { timestamps: true });

/* ---------------- INDEX OPTIMIZATION ---------------- */

adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ status: 1 });
adminSchema.index({ last_login: -1 });

module.exports = mongoose.model("Admin", adminSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Compound index for role + status queries
adminSchema.index({ role: 1, status: 1 });

// Index for sorting admins by creation date
adminSchema.index({ createdAt: -1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index only active admins
adminSchema.index(
{ status: 1 },
{ partialFilterExpression: { status: "active" } }
);

// Index only admins who have logged in
adminSchema.index(
{ last_login: 1 },
{ partialFilterExpression: { last_login: { $exists: true } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get admins by role
adminSchema.statics.getAdminsByRole = function(roleId){
return this.find({ role: roleId });
};

// Get active admins
adminSchema.statics.getActiveAdmins = function(){
return this.find({ status: "active" });
};

// Update last login time
adminSchema.statics.updateLastLogin = function(adminId){
return this.findByIdAndUpdate(
adminId,
{ last_login: new Date() },
{ new: true }
);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: admins grouped by status
adminSchema.statics.adminStatusSummaryView = function(){
return this.aggregate([
{
$group:{
_id: "$status",
total_admins: { $sum: 1 }
}
}
]);
};

// View: admins grouped by role
adminSchema.statics.adminsPerRoleView = function(){
return this.aggregate([
{
$group:{
_id: "$role",
total_admins: { $sum: 1 }
}
},
{
$sort:{ total_admins: -1 }
}
]);
};