const mongoose = require("mongoose");

const platformRevenueSchema = new mongoose.Schema({

revenue_id:String,

payment_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Payment"
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
},

instructor_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Instructor"
},

total_amount:Number,

platform_commission:Number,

instructor_payout:Number,

currency:String,

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("PlatformRevenue",platformRevenueSchema);