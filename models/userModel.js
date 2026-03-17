const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

user_id:{
type:String,
required:true,
unique:true
},

name:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password_hash:{
type:String,
required:true
},

role:{
type:String,
enum:["student","instructor","admin"],
required:true
},

plan:{
type:String,
enum:["free","pro"],
default:"free",
required:true
},

status:{
type:String,
enum:["active","inactive","suspended"],
default:"active",
required:true
},

profile_picture:{
type:String
},

bio:{
type:String
},

enrolled_courses:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
}],

completed_courses:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
}],

joined_at:{
type:Date,
default:Date.now
},

last_login:{
type:Date
}

});


/* =====================================================
TASK 1: INDEX OPTIMIZATION
Improves query performance in MongoDB
===================================================== */

// Email lookup optimization
userSchema.index({ email: 1 });

// Role based filtering (admin dashboards)
userSchema.index({ role: 1 });

// Status filtering
userSchema.index({ status: 1 });

// Compound index for role + status queries
userSchema.index({ role: 1, status: 1 });

// Index for course enrollment queries
userSchema.index({ enrolled_courses: 1 });

// Text search index (for name + bio search)
userSchema.index({ name: "text", bio: "text" });



/* =====================================================
TASK 2: DATABASE VALIDATION RULES
Validation at database schema level
===================================================== */

// Email format validation
userSchema.path("email").validate(function(email){
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}, "Invalid email format");


// Password hash minimum length validation
userSchema.path("password_hash").validate(function(password){
return password.length >= 8;
}, "Password hash must be at least 8 characters");


// Bio length restriction
userSchema.path("bio").validate(function(bio){
if(!bio) return true;
return bio.length <= 500;
}, "Bio cannot exceed 500 characters");



/* =====================================================
TASK 3: STORED PROCEDURE EQUIVALENTS (MODEL METHODS)
MongoDB uses functions instead of SQL procedures
===================================================== */

// Get all active users
userSchema.statics.getActiveUsers = async function(){
return this.find({ status: "active" });
};


// Get users by role
userSchema.statics.getUsersByRole = async function(role){
return this.find({ role: role });
};


// Update last login timestamp
userSchema.statics.updateLastLogin = async function(userId){
return this.findOneAndUpdate(
{ user_id: userId },
{ last_login: new Date() },
{ new: true }
);
};



/* =====================================================
TASK 4: DATABASE VIEW EQUIVALENT
Aggregation pipelines act like SQL views
===================================================== */

// View: User progress summary
userSchema.statics.userProgressView = async function(){

return this.aggregate([

{
$project:{
name:1,
email:1,
role:1,
plan:1,
status:1,
total_enrolled:{
$size:{
$ifNull:["$enrolled_courses",[]]
}
},
total_completed:{
$size:{
$ifNull:["$completed_courses",[]]
}
}
}

}

]);

};


module.exports = mongoose.model("User", userSchema);