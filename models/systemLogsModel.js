const mongoose = require("mongoose");

const systemLogsSchema = new mongoose.Schema({

log_id:String,

admin_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

action:String,

entity_type:String,

entity_id:String,

description:String,

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("SystemLog",systemLogsSchema);