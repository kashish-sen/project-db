const mongoose = require("mongoose");

const platformAnalyticsSchema = new mongoose.Schema({

analytics_id:String,

total_users:Number,

total_instructors:Number,

total_courses:Number,

total_enrollments:Number,

total_revenue:Number,

active_users:Number,

active_courses:Number,

average_course_rating:Number,

updated_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("PlatformAnalytics",platformAnalyticsSchema);