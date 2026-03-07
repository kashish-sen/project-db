const mongoose = require("mongoose");

const adminNotificationsSchema = new mongoose.Schema({

notification_id:String,

admin_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

message:String,

read_status:{
type:Boolean,
default:false
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("AdminNotification",adminNotificationsSchema);