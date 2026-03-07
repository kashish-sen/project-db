const mongoose = require("mongoose");

const courseReportsSchema = new mongoose.Schema({

report_id:String,

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

reported_by:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

reason:String,

description:String,

status:{
type:String,
default:"pending"
},

admin_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("CourseReport",courseReportsSchema);