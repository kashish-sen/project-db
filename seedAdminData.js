const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const Admin = require("./models/adminModel");
const AdminRole = require("./models/adminRolesModel");
const AdminCourseReview = require("./models/adminCourseReviewModel");

const PlatformAnalytics = require("./models/platformAnalyticsModel");
const PlatformRevenue = require("./models/platformRevenueModel");

const UserReport = require("./models/userReportsModel");
const CourseReport = require("./models/courseReportsModel");
const Dispute = require("./models/disputesModel");

const AdminNotification = require("./models/adminNotificationsModel");
const SystemLog = require("./models/systemLogsModel");

const User = require("./models/userModel");
const Course = require("./models/courseModel");
const Instructor = require("./models/instructorModel");
const Payment = require("./models/paymentModel");

connectDB();

const seedAdminData = async () => {

try {

await Admin.deleteMany({});
await AdminRole.deleteMany({});
await AdminCourseReview.deleteMany({});
await PlatformAnalytics.deleteMany({});
await PlatformRevenue.deleteMany({});
await UserReport.deleteMany({});
await CourseReport.deleteMany({});
await Dispute.deleteMany({});
await AdminNotification.deleteMany({});
await SystemLog.deleteMany({});

console.log("Old admin data removed");


// ADMIN ROLES

const roles = await AdminRole.insertMany([

{
role_id:"AR001",
role_name:"Super Admin",
permissions:[
"manage_users",
"manage_instructors",
"approve_courses",
"view_revenue"
]
},

{
role_id:"AR002",
role_name:"Content Moderator",
permissions:[
"review_courses",
"handle_reports"
]
},

{
role_id:"AR003",
role_name:"Finance Manager",
permissions:[
"view_revenue",
"manage_payouts"
]
}

]);


// ADMINS

const admins = await Admin.insertMany([

{
admin_id:"A001",
admin_name:"Rahul Khanna",
email:"rahul.admin@platform.com",
password_hash:"admin123",
phone_number:"9876543210",
role:roles[0]._id,
permissions:["all"]
},

{
admin_id:"A002",
admin_name:"Neha Kapoor",
email:"neha.admin@platform.com",
password_hash:"admin123",
phone_number:"9876543211",
role:roles[1]._id
}

]);

console.log("Admins created");


// FETCH EXISTING DATA

const users = await User.find();
const courses = await Course.find();
const instructors = await Instructor.find();
const payments = await Payment.find();


// COURSE REVIEWS

await AdminCourseReview.insertMany([

{
review_id:"CR001",
course_id:courses[0]._id,
instructor_id:instructors[0]._id,
instructor_name:"Dr Rajesh Sharma",
admin_id:admins[0]._id,
review_status:"approved",
review_notes:"Course quality verified"
},

{
review_id:"CR002",
course_id:courses[1]._id,
instructor_id:instructors[1]._id,
instructor_name:"Priya Mehta",
admin_id:admins[1]._id,
review_status:"approved",
review_notes:"Content meets platform standards"
}

]);


// PLATFORM ANALYTICS

await PlatformAnalytics.insertMany([

{
analytics_id:"PA001",
total_users:users.length,
total_instructors:instructors.length,
total_courses:courses.length,
total_enrollments:20,
total_revenue:150000,
active_users:5,
active_courses:10,
average_course_rating:4.5
}

]);


// PLATFORM REVENUE

await PlatformRevenue.insertMany([

{
revenue_id:"PR001",
payment_id:payments[0]?._id,
user_id:users[0]?._id,
course_id:courses[0]?._id,
instructor_id:instructors[0]?._id,
total_amount:4999,
platform_commission:999,
instructor_payout:4000,
currency:"INR"
}

]);


// USER REPORTS

await UserReport.insertMany([

{
report_id:"UR001",
reported_user_id:users[1]?._id,
reported_by:users[0]?._id,
reason:"Spam messages",
description:"User sending promotional spam",
status:"pending",
admin_id:admins[1]._id
}

]);


// COURSE REPORTS

await CourseReport.insertMany([

{
report_id:"CRP001",
course_id:courses[2]?._id,
instructor_id:instructors[0]?._id,
reported_by:users[2]?._id,
reason:"Outdated content",
description:"Course examples are outdated",
status:"pending",
admin_id:admins[1]._id
}

]);


// DISPUTES

await Dispute.insertMany([

{
dispute_id:"D001",
payment_id:payments[0]?._id,
user_id:users[0]?._id,
instructor_id:instructors[0]?._id,
reason:"Refund request",
status:"open",
admin_id:admins[0]._id
}

]);


// ADMIN NOTIFICATIONS

await AdminNotification.insertMany([

{
notification_id:"N001",
admin_id:admins[0]._id,
message:"New instructor applied for verification"
},

{
notification_id:"N002",
admin_id:admins[1]._id,
message:"User report pending review"
}

]);


// SYSTEM LOGS

await SystemLog.insertMany([

{
log_id:"LOG001",
admin_id:admins[0]._id,
action:"Approve Course",
entity_type:"Course",
entity_id:courses[0]?._id.toString(),
description:"Course approved by admin"
},

{
log_id:"LOG002",
admin_id:admins[1]._id,
action:"Review Report",
entity_type:"UserReport",
entity_id:"UR001",
description:"Admin reviewing spam report"
}

]);

console.log("ADMIN DATABASE SEEDED SUCCESSFULLY");

process.exit();

} catch(error){

console.error(error);
process.exit(1);

}

};

seedAdminData();