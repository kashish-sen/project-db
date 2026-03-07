const mongoose = require("mongoose");

const disputesSchema = new mongoose.Schema({

dispute_id:String,

payment_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Payment"
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

reason:String,

status:{
type:String,
enum:["open","resolved","rejected"],
default:"open"
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

module.exports = mongoose.model("Dispute",disputesSchema);