const mongoose = require("mongoose");

const adminRolesSchema = new mongoose.Schema({

role_id:String,

role_name:String,

permissions:[String],

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("AdminRole",adminRolesSchema);