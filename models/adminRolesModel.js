const mongoose = require("mongoose");

const adminRolesSchema = new mongoose.Schema({

    role_name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        maxlength: 200
    },

    access_level: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }

}, { timestamps: true });

/* INDEX */

adminRolesSchema.index({ role_name: 1 });

module.exports = mongoose.model("AdminRole", adminRolesSchema);


/* =====================================================
Additional Index Optimization
===================================================== */

// Index for access level queries
adminRolesSchema.index({ access_level: 1 });

// Compound index for role name + access level
adminRolesSchema.index({ role_name: 1, access_level: 1 });



/* =====================================================
Partial Indexing
===================================================== */

// Index roles where description exists
adminRolesSchema.index(
{ description: 1 },
{ partialFilterExpression: { description: { $exists: true } } }
);

// Index roles with higher access levels
adminRolesSchema.index(
{ access_level: 1 },
{ partialFilterExpression: { access_level: { $gte: 5 } } }
);



/* =====================================================
Stored Procedures (Model Methods)
===================================================== */

// Get role by name
adminRolesSchema.statics.getRoleByName = function(roleName){
return this.findOne({ role_name: roleName });
};

// Get roles by access level
adminRolesSchema.statics.getRolesByAccessLevel = function(level){
return this.find({ access_level: level });
};

// Create a new role
adminRolesSchema.statics.createRole = function(data){
return this.create(data);
};



/* =====================================================
Views (Aggregation Pipelines)
===================================================== */

// View: roles grouped by access level
adminRolesSchema.statics.rolesByAccessLevelView = function(){
return this.aggregate([
{
$group:{
_id: "$access_level",
total_roles: { $sum: 1 }
}
},
{
$sort:{ _id: 1 }
}
]);
};

// View: role details summary
adminRolesSchema.statics.roleSummaryView = function(){
return this.aggregate([
{
$project:{
role_name:1,
access_level:1,
description:1,
createdAt:1
}
}
]);
};