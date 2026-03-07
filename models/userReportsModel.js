const mongoose = require("mongoose");

const userReportsSchema = new mongoose.Schema({

report_id:String,

reported_user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
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

module.exports = mongoose.model("UserReport",userReportsSchema);