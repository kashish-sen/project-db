const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

admin_id:String,

admin_name:String,

email:String,

password_hash:String,

phone_number:String,

role:{
type:mongoose.Schema.Types.ObjectId,
ref:"AdminRole"
},

permissions:[String],

last_login:Date,

status:{
type:String,
default:"active"
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Admin",adminSchema);